import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Chat } from "@/lib/chat.model";
import { getServerSession } from "next-auth";
// Import from shared module instead of the route file to avoid Next.js static export error
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 200 });
  }
  try {
    await connectDB();
    const userId = session.user.email;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return NextResponse.json(chats);
  } catch (err) {
    console.error("GET /api/chats failed:", err);
    return NextResponse.json({ error: "Failed to load chats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { subject, messages } = await req.json();
  if (!subject || !messages) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }
  try {
    await connectDB();
    const userId = session.user.email;
    const chat = await Chat.create({ subject, messages, userId });
    return NextResponse.json(chat, { status: 201 });
  } catch (err) {
    console.error("POST /api/chats failed:", err);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { chatId, message } = await req.json();
  if (!chatId || !message) return NextResponse.json({ error: "Missing data" }, { status: 400 });
  if (!mongoose.isValidObjectId(chatId)) {
    return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
  }
  try {
    await connectDB();
    const userId = session.user.email;
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { $push: { messages: message }, $set: { updatedAt: new Date() } },
      { new: true }
    );
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    return NextResponse.json(chat);
  } catch (err) {
    console.error("PUT /api/chats failed:", err);
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
  }
}
