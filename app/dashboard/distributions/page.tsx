"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, Download, Filter, Loader2, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DistributionTable } from "@/components/distribution-table"

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchDistributions() {
      try {
        setLoading(true)

        let url = `/api/distributions?page=${pagination.page}&limit=${pagination.limit}`

        if (filter !== "all") {
          url += `&status=${filter}`
        }

        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setDistributions(data.distributions || [])
        setPagination(data.pagination || pagination)
      } catch (err) {
        console.error("Failed to fetch distributions:", err)
        setError("Failed to load distributions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDistributions()
  }, [pagination.page, filter, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    setSearchQuery(query)
    setPagination({ ...pagination, page: 1 }) // Reset to first page on new search
  }

  const handleFilterChange = (value) => {
    setFilter(value)
    setPagination({ ...pagination, page: 1 }) // Reset to first page on filter change
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page })
    window.scrollTo(0, 0)
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Distributions</h1>
          <p className="text-muted-foreground">Manage and track distribution activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Filter Date</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/dashboard/distributions/new">
              <Plus className="h-3.5 w-3.5" />
              <span>New Distribution</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Distribution Records</CardTitle>
          <CardDescription>View and manage all distribution activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search distributions..."
                    className="w-full bg-background pl-8"
                    defaultValue={searchQuery}
                  />
                </div>
              </form>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Status <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filter === "all"}
                    onCheckedChange={() => handleFilterChange("all")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter === "scheduled"}
                    onCheckedChange={() => handleFilterChange("scheduled")}
                  >
                    Scheduled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter === "in-progress"}
                    onCheckedChange={() => handleFilterChange("in-progress")}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter === "verified"}
                    onCheckedChange={() => handleFilterChange("verified")}
                  >
                    Verified
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filter === "pending"}
                    onCheckedChange={() => handleFilterChange("pending")}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : distributions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No distributions found.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/distributions/new">Create New Distribution</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <DistributionTable distributions={distributions} />
              </div>

              {pagination.pages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          disabled={pagination.page === 1}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum
                        if (pagination.pages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i
                        } else {
                          pageNum = pagination.page - 2 + i
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              isActive={pagination.page === pageNum}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                          disabled={pagination.page === pagination.pages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
