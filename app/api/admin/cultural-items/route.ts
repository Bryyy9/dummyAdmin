import { NextRequest, NextResponse } from "next/server"
import { culturalItemsService } from "@/lib/firestore"

export async function GET() {
  try {
    const items = await culturalItemsService.getAll()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await culturalItemsService.create(data)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}