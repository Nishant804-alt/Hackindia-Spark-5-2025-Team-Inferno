import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

import { getCollection, collections } from "./db"
import type { User } from "./models"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function createToken(walletAddress: string): Promise<string> {
  return jwt.sign({ walletAddress }, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string): Promise<{ walletAddress: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { walletAddress: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function getAuthUser(req?: NextRequest): Promise<User | null> {
  try {
    // Get token from cookies
    const cookieStore = cookies()
    const token = req?.cookies.get("token")?.value || cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = await verifyToken(token)
    if (!decoded) {
      return null
    }

    // Get user from database
    const usersCollection = await getCollection(collections.users)
    const user = await usersCollection.findOne({ walletAddress: decoded.walletAddress })

    return user as User
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return user
}
