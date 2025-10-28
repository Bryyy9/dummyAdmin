import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check both Authorization header and cookie
    const authHeader = request.headers.get("authorization")
    const cookieToken = request.cookies.get("adminToken")?.value
    
    const token = authHeader?.replace("Bearer ", "") || cookieToken

    console.log("Verifying token:", token ? "Token exists" : "No token")

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      )
    }

    try {
      // Decode token (in production, verify JWT)
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())

      console.log("Token decoded successfully:", decoded.email)

      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - (decoded.timestamp || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (tokenAge > maxAge) {
        return NextResponse.json(
          { message: "Token expired" },
          { status: 401 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
        },
      })
    } catch (decodeError) {
      console.error("Token decode error:", decodeError)
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}