"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ethers } from "ethers"
import { ObjectId } from "mongodb"

import { getCollection, collections } from "./db"
import { createToken } from "./auth"

// Message to sign
const MESSAGE_TO_SIGN = "Sign this message to authenticate with RationChain"

export async function login(walletAddress: string, signature: string) {
  try {
    // Verify signature
    const signerAddress = ethers.verifyMessage(MESSAGE_TO_SIGN, signature)

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return { error: "Invalid signature" }
    }

    // Check if user exists, if not create a new user
    const usersCollection = await getCollection(collections.users)
    let user = await usersCollection.findOne({ walletAddress: walletAddress.toLowerCase() })

    if (!user) {
      // Create new user
      const newUser = {
        walletAddress: walletAddress.toLowerCase(),
        role: "volunteer", // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await usersCollection.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    }

    // Create JWT token
    const token = await createToken(walletAddress.toLowerCase())

    // Set cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, user }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Authentication failed" }
  }
}

export async function logout() {
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  redirect("/login")
}

export async function createDistribution(formData: FormData) {
  try {
    const centerId = formData.get("centerId") as string
    const commodity = formData.get("commodity") as string
    const quantity = formData.get("quantity") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string

    // Validate required fields
    if (!centerId || !commodity || !quantity || !date) {
      return { error: "Missing required fields" }
    }

    // Get center details
    const centersCollection = await getCollection(collections.centers)
    const center = await centersCollection.findOne({ _id: new ObjectId(centerId) })

    if (!center) {
      return { error: "Distribution center not found" }
    }

    // Create distribution ID
    const distributionsCollection = await getCollection(collections.distributions)
    const count = await distributionsCollection.countDocuments()
    const distributionId = `DIST-${(count + 1).toString().padStart(4, "0")}`

    const newDistribution = {
      distributionId,
      centerId,
      centerName: center.name,
      commodity,
      quantity,
      date,
      time: time || "12:00 PM",
      status: "scheduled",
      geoVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await distributionsCollection.insertOne(newDistribution)

    revalidatePath("/dashboard/distributions")
    return { success: true }
  } catch (error) {
    console.error("Error creating distribution:", error)
    return { error: "Failed to create distribution" }
  }
}

export async function verifyDistribution(
  distributionId: string,
  geoLocation: { latitude: number; longitude: number },
  txHash?: string,
) {
  try {
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
      return { error: "Distribution not found" }
    }

    // Update distribution with verification data
    const result = await distributionsCollection.updateOne(query, {
      $set: {
        status: "verified",
        geoVerified: true,
        geoLocation,
        txHash: txHash || distribution.txHash,
        updatedAt: new Date(),
      },
    })

    if (result.modifiedCount === 0) {
      return { error: "Verification failed" }
    }

    // Record transaction if txHash provided
    if (txHash) {
      const transactionsCollection = await getCollection(collections.transactions)
      await transactionsCollection.insertOne({
        txHash,
        type: "verification",
        referenceId: distribution.distributionId,
        timestamp: new Date(),
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/distributions")
    return { success: true }
  } catch (error) {
    console.error("Error verifying distribution:", error)
    return { error: "Failed to verify distribution" }
  }
}

export async function createGrievance(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const centerId = formData.get("centerId") as string
    const userId = formData.get("userId") as string
    const userName = formData.get("userName") as string

    // Validate required fields
    if (!title || !description || !centerId) {
      return { error: "Missing required fields" }
    }

    // Get center details
    const centersCollection = await getCollection(collections.centers)
    const center = await centersCollection.findOne({ _id: new ObjectId(centerId) })

    if (!center) {
      return { error: "Distribution center not found" }
    }

    // Create grievance ID
    const grievancesCollection = await getCollection(collections.grievances)
    const count = await grievancesCollection.countDocuments()
    const grievanceId = `GR-${(count + 1).toString().padStart(4, "0")}`

    const newGrievance = {
      grievanceId,
      title,
      description,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      userId,
      userName,
      centerId,
      centerName: center.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await grievancesCollection.insertOne(newGrievance)

    revalidatePath("/dashboard/grievances")
    return { success: true }
  } catch (error) {
    console.error("Error creating grievance:", error)
    return { error: "Failed to create grievance" }
  }
}

export async function updateGrievanceStatus(grievanceId: string, status: string, resolution?: string) {
  try {
    const grievancesCollection = await getCollection(collections.grievances)

    // Try to find by _id first
    let query: any
    try {
      query = { _id: new ObjectId(grievanceId) }
    } catch (e) {
      // If not a valid ObjectId, use grievanceId
      query = { grievanceId }
    }

    const grievance = await grievancesCollection.findOne(query)

    if (!grievance) {
      return { error: "Grievance not found" }
    }

    // Update status
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (resolution) {
      updateData.resolution = resolution
    }

    const result = await grievancesCollection.updateOne(query, { $set: updateData })

    if (result.modifiedCount === 0) {
      return { error: "Update failed" }
    }

    revalidatePath("/dashboard/grievances")
    return { success: true }
  } catch (error) {
    console.error("Error updating grievance:", error)
    return { error: "Failed to update grievance" }
  }
}
