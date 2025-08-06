import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  sender: "user" | "assistant" | "error";
  text: string;
  createdAt?: Date;
}

export interface IChat extends Document {
  subject: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Add userId field to associate chat with user
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["user", "assistant", "error"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
  subject: { type: String, required: true },
  messages: { type: [MessageSchema], default: [] },
  userId: { type: String, required: true }, // Add userId to associate chat with user
}, { timestamps: true });

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
