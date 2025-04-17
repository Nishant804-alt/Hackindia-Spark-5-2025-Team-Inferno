import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Grievance } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const centerId = searchParams.get("centerId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (centerId) query.centerId = centerId

    // If user is a citizen, only show their grievances
    if (user.role === "citizen") {
      query.userId = user._id.toString()
    }

    const grievancesCollection = await getCollection(collections.grievances)

    // Get total count
    const total = await grievancesCollection.countDocuments(query)

    // Get grievances with pagination
    const grievances = await grievancesCollection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    return NextResponse.json({
      grievances,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching grievances:", error)
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const data = await req.json()

    // Validate required fields
    if (!data.title || !data.description || !data.centerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get center details
    const centersCollection = await getCollection(collections.centers)
    const center = await centersCollection.findOne({ _id: new ObjectId(data.centerId) })

    if (!center) {
      return NextResponse.json({ error: "Distribution center not found" }, { status: 404 })
    }

    // Create grievance ID
    const grievancesCollection = await getCollection(collections.grievances)
    const count = await grievancesCollection.countDocuments()
    const grievanceId = `GR-${(count + 1).toString().padStart(4, "0")}`

    const newGrievance: Grievance = {
      grievanceId,
      title: data.title,
      description: data.description,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      userId: user._id.toString(),
      userName: user.name || `User-${user._id.toString().substring(0, 6)}`,
      centerId: data.centerId,
      centerName: center.name,
      txHash: data.txHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await grievancesCollection.insertOne(newGrievance)

    return NextResponse.json({
      success: true,
      grievance: { ...newGrievance, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating grievance:", error)
    return NextResponse.json({ error: "Failed to create grievance" }, { status: 500 })
  }
}
