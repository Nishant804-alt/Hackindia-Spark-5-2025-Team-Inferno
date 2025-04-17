"use client"

import { useState } from "react"
import { AlertCircle, ChevronDown, Clock, FileText, Filter, Search, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GrievancesPage() {
  const [filter, setFilter] = useState("all")

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grievances</h1>
          <p className="text-muted-foreground">Manage and respond to citizen grievances</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search grievances..." className="w-full bg-background pl-8" />
            </div>
          </form>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={filter === "all"} onCheckedChange={() => setFilter("all")}>
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === "open"} onCheckedChange={() => setFilter("open")}>
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter === "in-progress"}
                onCheckedChange={() => setFilter("in-progress")}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === "resolved"} onCheckedChange={() => setFilter("resolved")}>
                Resolved
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="open">
        <TabsList className="mb-4">
          <TabsTrigger value="open">Open (12)</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress (6)</TabsTrigger>
          <TabsTrigger value="resolved">Resolved (24)</TabsTrigger>
        </TabsList>
        <TabsContent value="open" className="space-y-4">
          <GrievanceCard
            id="GR-1234"
            title="Missing wheat allocation in April distribution"
            description="I did not receive my wheat allocation during the April 15th distribution at Sector 5 center."
            status="Open"
            date="April 18, 2025"
            user="Rahul Sharma"
            center="Sector 5 Distribution Center"
          />
          <GrievanceCard
            id="GR-1235"
            title="Quality issues with rice distribution"
            description="The rice distributed on April 16th was of poor quality with many impurities."
            status="Open"
            date="April 17, 2025"
            user="Priya Patel"
            center="Sector 3 Distribution Center"
          />
          <GrievanceCard
            id="GR-1236"
            title="Incorrect quantity of sugar distributed"
            description="I received only 2kg of sugar instead of the allocated 5kg during the distribution."
            status="Open"
            date="April 16, 2025"
            user="Amit Kumar"
            center="Sector 8 Distribution Center"
          />
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <GrievanceCard
            id="GR-1230"
            title="Long waiting times at distribution center"
            description="The waiting time at Sector 12 center was over 3 hours which is too long for elderly citizens."
            status="In Progress"
            date="April 14, 2025"
            user="Sunita Devi"
            center="Sector 12 Distribution Center"
          />
          <GrievanceCard
            id="GR-1231"
            title="Rude behavior by distribution staff"
            description="The staff at Sector 1 center was rude and unhelpful during the April 12th distribution."
            status="In Progress"
            date="April 13, 2025"
            user="Rajesh Singh"
            center="Sector 1 Distribution Center"
          />
        </TabsContent>
        <TabsContent value="resolved" className="space-y-4">
          <GrievanceCard
            id="GR-1220"
            title="Missing oil allocation"
            description="I did not receive my oil allocation during the March distribution."
            status="Resolved"
            date="March 25, 2025"
            user="Vikram Mehta"
            center="Sector 5 Distribution Center"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GrievanceCard({ id, title, description, status, date, user, center }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm">
              {id} • Reported by {user}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              status === "Open"
                ? "bg-red-50 text-red-700 border-red-200"
                : status === "In Progress"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-green-50 text-green-700 border-green-200"
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Reported on {date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{user}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{center}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View on Blockchain
        </Button>
        <div className="flex gap-2">
          {status === "Open" && <Button size="sm">Assign</Button>}
          {status === "In Progress" && <Button size="sm">Resolve</Button>}
          <Button variant="outline" size="sm">
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
