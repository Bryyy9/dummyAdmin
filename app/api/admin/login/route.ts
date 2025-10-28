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
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = ADMIN_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64")

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
