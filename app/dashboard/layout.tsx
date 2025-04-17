"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }) {
  const router = useRouter()

  // Check if MetaMask is connected
  useEffect(() => {
    const checkConnection = async () => {
      // This is a simplified check - in a real app, you would verify
      // the connection status more thoroughly
      if (typeof window.ethereum === "undefined") {
        router.push("/login")
        return
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length === 0) {
          router.push("/login")
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error)
        router.push("/login")
      }
    }

    checkConnection()
  }, [router])

  return children
}
