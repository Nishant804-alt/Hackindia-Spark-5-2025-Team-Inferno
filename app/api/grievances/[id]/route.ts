import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const id = params.id

    const grievancesCollection = await getCollection(collections.grievances)

    // Try to find by _id first
    let grievance
    try {
      grievance = await grievancesCollection.findOne({ _id: new ObjectId(id) })
    } catch (e) {
      // If not a valid ObjectId, try to find by grievanceId
      grievance = await grievancesCollection.findOne({ grievanceId: id })
    }

    if (!grievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 })
    }

    // If user is a citizen, check if they own the grievance
    if (user.role === "citizen" && grievance.userId !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ grievance })
  } catch (error) {
    console.error("Error fetching grievance:", error)
    return NextResponse.json({ error: "Failed to fetch grievance" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const id = params.id
    const data = await req.json()

    const grievancesCollection = await getCollection(collections.grievances)

    // Try to find by _id first
    let query: any
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      // If not a valid ObjectId, use grievanceId
      query = { grievanceId: id }
    }

    const grievance = await grievancesCollection.findOne(query)

    if (!grievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 })
    }

    // If user is a citizen, check if they own the grievance
    if (user.role === "citizen" && grievance.userId !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update fields
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    // Remove _id if present to avoid MongoDB error
    if (updateData._id) delete updateData._id

    const result = await grievancesCollection.updateOne(query, { $set: updateData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made" }, { status: 400 })
    }

    // Get updated grievance
    const updatedGrievance = await grievancesCollection.findOne(query)

    return NextResponse.json({ success: true, grievance: updatedGrievance })
  } catch (error) {
    console.error("Error updating grievance:", error)
    return NextResponse.json({ error: "Failed to update grievance" }, { status: 500 })
  }
}
