import { type NextRequest, NextResponse } from "next/server"

// Mock admin users - replace with database query
const ADMIN_USERS = [
  {
    id: 1,
    email: "admin@budaya.com",
    password: "admin123", // In production, use hashed passwords
    name: "Admin User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt:", { email, password: "***" })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!user) {
      console.log("User not found or password mismatch")
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create token (in production, use JWT)
    const token = Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        timestamp: Date.now(),
      })
    ).toString("base64")

    console.log("Login successful for:", user.email)

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })

    // Set cookie
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
