"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock, Loader2, MapPin, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DistributionTable() {
  const [distributions, setDistributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDistributions() {
      try {
        const response = await fetch("/api/distributions?limit=5")
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setDistributions(data.distributions || [])
      } catch (err) {
        console.error("Failed to fetch distributions:", err)
        setError("Failed to load distributions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDistributions()
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
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (distributions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No distributions found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Commodity</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="hidden md:table-cell">Distribution Center</TableHead>
            <TableHead className="hidden md:table-cell">Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distributions.map((distribution) => (
            <TableRow key={distribution._id}>
              <TableCell className="font-medium">{distribution.distributionId}</TableCell>
              <TableCell>{distribution.commodity}</TableCell>
              <TableCell>{distribution.quantity}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{distribution.centerName}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span>{distribution.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{distribution.time}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {distribution.status === "verified" ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : distribution.status === "scheduled" ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Scheduled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => (window.location.href = `/dashboard/distributions/${distribution._id}`)}
                    >
                      View details
                    </DropdownMenuItem>
                    {distribution.txHash && (
                      <DropdownMenuItem
                        onClick={() => window.open(`https://etherscan.io/tx/${distribution.txHash}`, "_blank")}
                      >
                        View on blockchain
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Export data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
