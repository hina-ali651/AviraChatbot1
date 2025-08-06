import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Chat } from "@/lib/chat.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  await db;
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 200 });
  }
  const userId = session.user.email;
  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
  return NextResponse.json(chats);
}

export async function POST(req: NextRequest) {
  await db;
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.email;
  const { subject, messages } = await req.json();
  if (!subject || !messages) return NextResponse.json({ error: "Missing data" }, { status: 400 });
  const chat = await Chat.create({ subject, messages, userId });
  return NextResponse.json(chat, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await db;
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.email;
  const { chatId, message } = await req.json();
  if (!chatId || !message) return NextResponse.json({ error: "Missing data" }, { status: 400 });
  const chat = await Chat.findOneAndUpdate(
    { _id: chatId, userId },
    { $push: { messages: message }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  return NextResponse.json(chat);
}
