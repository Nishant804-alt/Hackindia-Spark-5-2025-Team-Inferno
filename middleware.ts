import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getAuthUser } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const user = await getAuthUser(request)

    // If not authenticated, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Check if the request is for the login page and user is already authenticated
  if (request.nextUrl.pathname === "/login") {
    const user = await getAuthUser(request)

    // If authenticated, redirect to dashboard
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
