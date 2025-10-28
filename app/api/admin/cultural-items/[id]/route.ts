import { NextRequest, NextResponse } from "next/server"
import { culturalItemsService } from "@/lib/firestore"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await culturalItemsService.getById(params.id)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    await culturalItemsService.update(params.id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await culturalItemsService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
