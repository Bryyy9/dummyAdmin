import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("adminToken")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
