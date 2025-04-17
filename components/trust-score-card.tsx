"use client"

import { useEffect, useState } from "react"
import { Loader2, Shield } from "lucide-react"

import { Progress } from "@/components/ui/progress"

export function TrustScoreCard() {
  const [trustScores, setTrustScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTrustScores() {
      try {
        const response = await fetch("/api/centers/trust-scores")
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setTrustScores(data.centers || [])
      } catch (err) {
        console.error("Failed to fetch trust scores:", err)
        setError("Failed to load trust scores. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrustScores()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{error}</p>
      </div>
    )
  }

  if (trustScores.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No trust scores available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trustScores.map((center) => (
        <div key={center._id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield
                className={`h-4 w-4 ${center.trustScore > 80 ? "text-green-500" : center.trustScore > 70 ? "text-yellow-500" : "text-orange-500"}`}
              />
              <span className="text-sm font-medium">{center.name}</span>
            </div>
            <span className="text-sm font-medium">{center.trustScore}%</span>
          </div>
          <Progress
            value={center.trustScore}
            className="h-2"
            indicatorClassName={
              center.trustScore > 80 ? "bg-green-500" : center.trustScore > 70 ? "bg-yellow-500" : "bg-orange-500"
            }
          />
        </div>
      ))}
    </div>
  )
}
