import { type NextRequest, NextResponse } from "next/server"

import { getCollection, collections } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (!user) return

    // Get collections
    const distributionsCollection = await getCollection(collections.distributions)
    const grievancesCollection = await getCollection(collections.grievances)
    const centersCollection = await getCollection(collections.centers)
    const usersCollection = await getCollection(collections.users)

    // Calculate stats
    const totalDistributions = await distributionsCollection.countDocuments()

    // Estimate beneficiaries (for demo purposes)
    const beneficiariesPerDistribution = 20
    const beneficiariesServed = totalDistributions * beneficiariesPerDistribution

    // Calculate average trust score
    const centers = await centersCollection.find({}, { projection: { trustScore: 1 } }).toArray()
    const averageTrustScore =
      centers.length > 0 ? Math.round(centers.reduce((acc, center) => acc + center.trustScore, 0) / centers.length) : 0

    // Count pending grievances
    const pendingGrievances = await grievancesCollection.countDocuments({ status: "open" })

    // Get recent distributions
    const recentDistributions = await distributionsCollection.find().sort({ createdAt: -1 }).limit(5).toArray()

    // Get upcoming distributions
    const today = new Date()
    const upcomingDistributions = await distributionsCollection
      .find({
        status: "scheduled",
        date: { $gte: today.toISOString().split("T")[0] },
      })
      .sort({ date: 1, time: 1 })
      .limit(5)
      .toArray()

    // Get completed distributions
    const completedDistributions = await distributionsCollection
      .find({ status: "verified" })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    // Get distributions with issues
    const issueDistributions = await distributionsCollection
      .find({ status: { $in: ["pending"] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json({
      stats: {
        totalDistributions,
        beneficiariesServed,
        averageTrustScore,
        pendingGrievances,
      },
      recentDistributions,
      upcomingDistributions,
      completedDistributions,
      issueDistributions,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
