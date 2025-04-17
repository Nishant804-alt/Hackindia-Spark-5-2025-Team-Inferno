import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    const { distributionId, geoLocation, txHash } = await req.json()

    if (!distributionId || !geoLocation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const distributionsCollection = await getCollection(collections.distributions)

    // Try to find by _id first
    let query: any
    try {
      query = { _id: new ObjectId(distributionId) }
    } catch (e) {
      // If not a valid ObjectId, use distributionId
      query = { distributionId }
    }

    const distribution = await distributionsCollection.findOne(query)

    if (!distribution) {
      return NextResponse.json({ error: "Distribution not found" }, { status: 404 })
    }

    // Update distribution with verification data
    const result = await distributionsCollection.updateOne(query, {
      $set: {
        status: "verified",
        geoVerified: true,
        geoLocation,
        txHash: txHash || distribution.txHash,
        verifiedBy: user.walletAddress,
        updatedAt: new Date(),
      },
    })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 })
    }

    // Record transaction
    if (txHash) {
      const transactionsCollection = await getCollection(collections.transactions)
      await transactionsCollection.insertOne({
        txHash,
        type: "verification",
        referenceId: distribution.distributionId,
        walletAddress: user.walletAddress,
        timestamp: new Date(),
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Get updated distribution
    const updatedDistribution = await distributionsCollection.findOne(query)

    return NextResponse.json({ success: true, distribution: updatedDistribution })
  } catch (error) {
    console.error("Error verifying distribution:", error)
    return NextResponse.json({ error: "Failed to verify distribution" }, { status: 500 })
  }
}
