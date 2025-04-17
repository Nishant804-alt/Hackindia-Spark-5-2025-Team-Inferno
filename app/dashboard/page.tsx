"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Home,
  Loader2,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Shield,
  User,
  Users,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DistributionTable } from "@/components/distribution-table"
import { TrustScoreCard } from "@/components/trust-score-card"
import { logout } from "@/lib/actions"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/auth/me")
        const userData = await userResponse.json()

        if (userData.error) {
          throw new Error(userData.error)
        }

        setUser(userData.user)

        // Fetch dashboard stats
        const statsResponse = await fetch("/api/dashboard/stats")
        const statsData = await statsResponse.json()

        if (statsData.error) {
          throw new Error(statsData.error)
        }

        setDashboardData(statsData)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-none">
                <div className="flex items-center gap-2 pb-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    🌾 RationChain
                  </Link>
                  <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(false)} className="ml-auto">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/distributions"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    Distributions
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5" />
                    Analytics
                  </Link>
                  <Link
                    href="/dashboard/grievances"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    Grievances
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="hidden md:inline-block">🌾 RationChain</span>
              <span className="md:hidden">🌾</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 rounded-lg bg-background pl-8 md:w-80 lg:w-96"
                />
              </div>
            </form>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">
                    {user ? user.name || user.walletAddress.substring(0, 6) + "..." : "Account"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 text-sm">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/distributions"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Distributions
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/dashboard/grievances"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Grievances
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
            <div className="mt-auto">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Connected Wallet</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="rounded-full bg-green-500 h-2 w-2"></div>
                    <span className="font-mono">
                      {user
                        ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`
                        : "0x1a2...3b4c"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Monitor and manage public distribution activities</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>April 2025</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Distributions</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.stats?.totalDistributions || 0}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Beneficiaries Served</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.stats?.beneficiariesServed || 0}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Average Trust Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.stats?.averageTrustScore || 0}%</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Pending Grievances</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.stats?.pendingGrievances || 0}</div>
                  <p className="text-xs text-muted-foreground">-4% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-6">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Distributions</CardTitle>
                  <CardDescription>Overview of recent distribution activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <DistributionTable />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/distributions">View All Distributions</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Trust Score</CardTitle>
                  <CardDescription>Distribution center reliability metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TrustScoreCard />
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Tabs defaultValue="upcoming">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <TabsContent value="upcoming" className="mt-4 space-y-4">
                  {dashboardData?.upcomingDistributions?.length > 0 ? (
                    dashboardData.upcomingDistributions.map((distribution) => (
                      <Card key={distribution._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {distribution.commodity} Distribution - {distribution.centerName}
                                </h3>
                                <Badge>Scheduled</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{distribution.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{distribution.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{distribution.centerName}</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/dashboard/distributions/${distribution._id}`}>Verify</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No upcoming distributions found.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="mt-4 space-y-4">
                  {dashboardData?.completedDistributions?.length > 0 ? (
                    dashboardData.completedDistributions.map((distribution) => (
                      <Card key={distribution._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {distribution.commodity} Distribution - {distribution.centerName}
                                </h3>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{distribution.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{distribution.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{distribution.centerName}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/distributions/${distribution._id}`}>Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No completed distributions found.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="issues" className="mt-4 space-y-4">
                  {dashboardData?.issueDistributions?.length > 0 ? (
                    dashboardData.issueDistributions.map((distribution) => (
                      <Card key={distribution._id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {distribution.commodity} Distribution - {distribution.centerName}
                                </h3>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Issue Reported
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{distribution.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{distribution.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{distribution.centerName}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="destructive" size="sm" asChild>
                              <Link href={`/dashboard/distributions/${distribution._id}`}>Resolve</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No issues reported.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
