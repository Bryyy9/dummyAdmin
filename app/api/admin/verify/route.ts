import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Decode token (in production, verify JWT)
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    return NextResponse.json({ user: decoded })
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
