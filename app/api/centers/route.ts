import { type NextRequest, NextResponse } from "next/server"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import type { DistributionCenter } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const centersCollection = await getCollection(collections.centers)
    const centers = await centersCollection.find().sort({ name: 1 }).toArray()

    return NextResponse.json({ centers })
  } catch (error) {
    console.error("Error fetching centers:", error)
    return NextResponse.json({ error: "Failed to fetch centers" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    // Only admins can create centers
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newCenter: DistributionCenter = {
      name: data.name,
      location: data.location,
      trustScore: data.trustScore || 75, // Default trust score
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const centersCollection = await getCollection(collections.centers)
    const result = await centersCollection.insertOne(newCenter)

    return NextResponse.json({
      success: true,
      center: { ...newCenter, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating center:", error)
    return NextResponse.json({ error: "Failed to create center" }, { status: 500 })
  }
}
