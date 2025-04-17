import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const id = params.id

    const distributionsCollection = await getCollection(collections.distributions)

    // Try to find by _id first
    let distribution
    try {
      distribution = await distributionsCollection.findOne({ _id: new ObjectId(id) })
    } catch (e) {
      // If not a valid ObjectId, try to find by distributionId
      distribution = await distributionsCollection.findOne({ distributionId: id })
    }

    if (!distribution) {
      return NextResponse.json({ error: "Distribution not found" }, { status: 404 })
    }

    return NextResponse.json({ distribution })
  } catch (error) {
    console.error("Error fetching distribution:", error)
    return NextResponse.json({ error: "Failed to fetch distribution" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const id = params.id
    const data = await req.json()

    const distributionsCollection = await getCollection(collections.distributions)

    // Try to find by _id first
    let query: any
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      // If not a valid ObjectId, use distributionId
      query = { distributionId: id }
    }

    const distribution = await distributionsCollection.findOne(query)

    if (!distribution) {
      return NextResponse.json({ error: "Distribution not found" }, { status: 404 })
    }

    // Update fields
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    // Remove _id if present to avoid MongoDB error
    if (updateData._id) delete updateData._id

    const result = await distributionsCollection.updateOne(query, { $set: updateData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 })
    }

    // Get updated distribution
    const updatedDistribution = await distributionsCollection.findOne(query)

    return NextResponse.json({ success: true, distribution: updatedDistribution })
  } catch (error) {
    console.error("Error updating distribution:", error)
    return NextResponse.json({ error: "Failed to update distribution" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    // Only admins can delete
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id

    const distributionsCollection = await getCollection(collections.distributions)

    // Try to find by _id first
    let query: any
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      // If not a valid ObjectId, use distributionId
      query = { distributionId: id }
    }

    const result = await distributionsCollection.deleteOne(query)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Distribution not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting distribution:", error)
    return NextResponse.json({ error: "Failed to delete distribution" }, { status: 500 })
  }
}
