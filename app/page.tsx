import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">🌾 RationChain</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </Link>
              <Link
                href="#about"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transparent Public Distribution System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A Web3 + AI-powered solution to bring transparency, geo-verification, and trust to India&apos;s
                    Public Distribution System (PDS).
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=550&width=550"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Empowering Citizens, Reducing Fraud
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  RationChain brings transparency and accountability to the Public Distribution System through
                  blockchain technology.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Immutable Records</h3>
                </div>
                <p className="text-muted-foreground">
                  All delivery events are recorded on-chain, creating a tamper-proof audit trail.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Geo-Verification</h3>
                </div>
                <p className="text-muted-foreground">
                  Chainlink Functions validate timestamp and geolocation for every distribution event.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Trust Score System</h3>
                </div>
                <p className="text-muted-foreground">
                  AI-powered trust scores help identify reliable distribution centers and flag potential issues.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How RationChain Works</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform connects all stakeholders in the Public Distribution System through blockchain technology.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link href="/dashboard">
                <Button>View Dashboard</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Connect Wallet</Button>
              </Link>
            </div>
            <div className="grid gap-6 lg:col-span-2">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-center justify-center rounded-full border bg-muted h-12 w-12 mb-4">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold">Distribution Centers</h3>
                  <p className="text-muted-foreground">
                    Distribution centers log deliveries on the blockchain with geo-verification.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-center justify-center rounded-full border bg-muted h-12 w-12 mb-4">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold">NGOs & Volunteers</h3>
                  <p className="text-muted-foreground">
                    Monitor distributions in real-time and verify delivery through the dashboard.
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-6">
                  <div className="flex items-center justify-center rounded-full border bg-muted h-12 w-12 mb-4">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold">Citizens</h3>
                  <p className="text-muted-foreground">
                    Submit feedback and grievances that are recorded on-chain for transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About RationChain</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built for HackIndia 2025, RationChain is a decentralized ration tracking platform focused on
                  empowering citizens, reducing fraud, and ensuring timely delivery of essential commodities.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="https://github.com/yourusername/rationchain" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">View on GitHub</Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Tech Stack</h3>
                <ul className="grid gap-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Smart Contracts (Solidity)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Chainlink Functions for geo-verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>MetaMask Integration for wallet-based authentication</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Next.js frontend with responsive UI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Express.js backend APIs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 RationChain. Built for HackIndia 2025.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
