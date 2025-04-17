"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/actions"

// Message to sign
const MESSAGE_TO_SIGN = "Sign this message to authenticate with RationChain"

export default function LoginPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const walletAddress = accounts[0]

      // Request signature
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [MESSAGE_TO_SIGN, walletAddress],
      })

      // Call server action to authenticate
      const result = await login(walletAddress, signature)

      if (result.error) {
        throw new Error(result.error)
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to connect wallet. Please try again.")
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Connect Wallet</CardTitle>
          <CardDescription>Connect your MetaMask wallet to access the RationChain dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-center">
            <img
              src="/placeholder.svg?height=100&width=100"
              width="100"
              height="100"
              alt="MetaMask"
              className="h-24 w-24"
            />
          </div>
          <Button className="w-full" onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect with MetaMask
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have MetaMask installed?{" "}
            <Link
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              Download here
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-primary">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
