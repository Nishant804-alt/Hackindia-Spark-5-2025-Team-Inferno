import { type NextRequest, NextResponse } from "next/server"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const centersCollection = await getCollection(collections.centers)

    // Get centers with their trust scores
    const centers = await centersCollection
      .find({}, { projection: { name: 1, trustScore: 1 } })
      .sort({ trustScore: -1 })
      .toArray()

    return NextResponse.json({ centers })
  } catch (error) {
    console.error("Error fetching trust scores:", error)
    return NextResponse.json({ error: "Failed to fetch trust scores" }, { status: 500 })
  }
}
