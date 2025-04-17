import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"

import { getCollection, collections } from "@/lib/db"
import { createToken } from "@/lib/auth"

// Message to sign
const MESSAGE_TO_SIGN = "Sign this message to authenticate with RationChain"

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, signature } = await req.json()

    if (!walletAddress || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify signature
    const signerAddress = ethers.verifyMessage(MESSAGE_TO_SIGN, signature)

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
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
    const response = NextResponse.json({ success: true, user })
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
