import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const id = params.id

    const centersCollection = await getCollection(collections.centers)
    const center = await centersCollection.findOne({ _id: new ObjectId(id) })

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 })
    }

    return NextResponse.json({ center })
  } catch (error) {
    console.error("Error fetching center:", error)
    return NextResponse.json({ error: "Failed to fetch center" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    // Only admins can update centers
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id
    const data = await req.json()

    const centersCollection = await getCollection(collections.centers)

    // Update fields
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    // Remove _id if present to avoid MongoDB error
    if (updateData._id) delete updateData._id

    const result = await centersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 })
    }

    // Get updated center
    const updatedCenter = await centersCollection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, center: updatedCenter })
  } catch (error) {
    console.error("Error updating center:", error)
    return NextResponse.json({ error: "Failed to update center" }, { status: 500 })
  }
}
