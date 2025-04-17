import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { Distribution } from "@/lib/models"

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

    const distributionsCollection = await getCollection(collections.distributions)

    // Get total count
    const total = await distributionsCollection.countDocuments(query)

    // Get distributions with pagination
    const distributions = await distributionsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      distributions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching distributions:", error)
    return NextResponse.json({ error: "Failed to fetch distributions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const data = await req.json()

    // Validate required fields
    if (!data.centerId || !data.commodity || !data.quantity || !data.date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get center details
    const centersCollection = await getCollection(collections.centers)
    const center = await centersCollection.findOne({ _id: new ObjectId(data.centerId) })

    if (!center) {
      return NextResponse.json({ error: "Distribution center not found" }, { status: 404 })
    }

    // Create distribution ID
    const distributionsCollection = await getCollection(collections.distributions)
    const count = await distributionsCollection.countDocuments()
    const distributionId = `DIST-${(count + 1).toString().padStart(4, "0")}`

    const newDistribution: Distribution = {
      distributionId,
      centerId: data.centerId,
      centerName: center.name,
      commodity: data.commodity,
      quantity: data.quantity,
      date: data.date,
      time: data.time || "12:00 PM",
      status: data.status || "scheduled",
      geoVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await distributionsCollection.insertOne(newDistribution)

    return NextResponse.json({
      success: true,
      distribution: { ...newDistribution, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating distribution:", error)
    return NextResponse.json({ error: "Failed to create distribution" }, { status: 500 })
  }
}
