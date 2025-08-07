"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../components/sidebar/Sidebar";
import { WelcomeMessage } from "../components/chat/WelcomeMessage";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { Header } from "../components/Header";

type Message = {
  sender: "user" | "assistant" | "error";
  text: string;
};

type Chat = {
  id: string;
  subject: string;
  messages: Message[];
};

export default function Home() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chats from MongoDB on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/chats")
        .then(res => res.json())
        .then(data => {
          // Normalize MongoDB _id to id (always string)
          const normalized = data.map((chat: any) => ({
            id: chat._id ? String(chat._id) : String(chat.id || ""),
            subject: chat.subject,
            messages: chat.messages,
          }));
          setChats(normalized);
          if (normalized.length > 0) setCurrentChatId(normalized[0].id);
        });
    }
  }, [status]);

  // When a chat is selected, fetch its latest messages from DB
  useEffect(() => {
    if (!currentChatId) return;
    fetch(`/api/chats`) // This will fetch all chats, could be optimized
      .then(res => res.json())
      .then(data => {
        const chat = data.find((c: any) => (c._id ? String(c._id) : String(c.id || "")) === currentChatId);
        if (chat) {
          setChats(prev => prev.map(c => c.id === currentChatId ? {
            id: chat._id ? String(chat._id) : String(chat.id || ""),
            subject: chat.subject,
            messages: chat.messages,
          } : c));
        }
      });
  }, [currentChatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    let chatId = currentChatId;
    let isNewChat = false;
    // If no chat is selected, create a new chat and set it as current
    if (!chatId) {
      const newChat = {
        subject: input.trim().slice(0, 30) + "...",
        messages: [],
      };
      // Save new chat to DB
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newChat }),
      });
      const savedChat = await res.json();
      chatId = savedChat._id ? String(savedChat._id) : String(savedChat.id || "");
      setChats(prev => [
        ...prev,
        {
          id: chatId ?? "", // fallback to empty string if undefined/null
          subject: savedChat.subject,
          messages: savedChat.messages,
        }
      ]);
      setCurrentChatId(chatId);
      isNewChat = true;
    }

    const userMessage: Message = {
      sender: "user",
      text: input.trim(),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              subject: chat.messages.length === 0 ? input.trim().slice(0, 30) + "..." : chat.subject
            }
          : chat
      )
    );
    setInput("");
    setIsLoading(true);

    // Save message to DB
    await fetch("/api/chats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, message: userMessage }),
    });

    // Focus the input after sending
    if (inputRef && inputRef.current) inputRef.current.focus();

    try {
      // Send full chat history to backend for context
      const chatHistory = chats.find(chat => chat.id === chatId)?.messages || [];
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${backendUrl}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: userMessage.text,
          history: chatHistory,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = "";
      let finalAssistantText = "";

      // This part seems to have a bug in the original code, where a new message is added for each chunk.
      // A better approach would be to update the last assistant message.
      let assistantMessageIndex = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantReply += decoder.decode(value, { stream: true });

        // This is a simplistic way to parse, might not be robust
        let parsedText = assistantReply;
        try {
          const json = JSON.parse(assistantReply);
          if (json.output) {
            parsedText = json.output.trim();
          }
        } catch {
          // It's not a JSON object, so use the text as is.
          parsedText = assistantReply.trim();
        }
        finalAssistantText = parsedText;

        setChats(prevChats => {
          const newChats = [...prevChats];
          const chatIndex = newChats.findIndex(c => c.id === chatId);
          if (chatIndex !== -1) {
              const currentMessages = newChats[chatIndex].messages;
              if (assistantMessageIndex === -1 || currentMessages[assistantMessageIndex]?.sender !== 'assistant') {
                  // Add new assistant message
                  currentMessages.push({ sender: 'assistant', text: parsedText });
                  assistantMessageIndex = currentMessages.length - 1;
              } else {
                  // Update existing assistant message
                  currentMessages[assistantMessageIndex] = { sender: 'assistant', text: parsedText };
              }
          }
          return newChats;
      });
      }
      // Save assistant message to DB after streaming is done
      if (finalAssistantText) {
        await fetch("/api/chats", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, message: { sender: "assistant", text: finalAssistantText } }),
        });
      }
    } catch (err: any) {
      const errorMessage: Message = {
        sender: "error",
        text: err.message || "Failed to contact server",
      };
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage]
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    // Reset input and current chat ID
    setInput("");
    setCurrentChatId(null);
  
    // Optionally focus the input field for a new message
    inputRef.current?.focus();
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };
  
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen bg-gray-950">Loading...</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
        {/* Sidebar for desktop, slide-in for mobile */}
        <div className="hidden md:block">
            <Sidebar 
                onNewChat={handleNewChat} 
                chats={chats}
                currentChatId={currentChatId}
                onSelectChat={handleSelectChat}
            />
        </div>
        {/* Mobile sidebar overlay */}
        <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-black/40`} style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
            <Sidebar 
                onNewChat={() => { setSidebarOpen(false); handleNewChat(); }}
                chats={chats}
                currentChatId={currentChatId}
                onSelectChat={(id) => { setSidebarOpen(false); handleSelectChat(id); }}
            />
            {/* Click outside to close */}
            <div className="fixed inset-0 z-30" onClick={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <AnimatePresence mode="wait">
                    {messages.length === 0 ? (
                        <WelcomeMessage
                            userName={session?.user?.name ?? session?.user?.email ?? "User"}
                            input={input}
                            setInput={setInput}
                            handleSend={handleSend}
                            isLoading={isLoading}
                        />
                    ) : (
                        <motion.div
                            className="space-y-4 pb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {messages.map((message, index) => (
                                <ChatMessage key={index} message={message} />
                            ))}
                            {isLoading && (
                                <motion.div
                                    className="flex items-center space-x-2 text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Bot className="w-5 h-5 animate-pulse" />
                                    <span>Avira is typing...</span>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {messages.length > 0 && (
                <motion.div
                    className="p-4 border-t border-gray-800 bg-gray-900"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <ChatInput
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        isLoading={isLoading}
                        inputRef={inputRef as React.RefObject<HTMLInputElement>}
                    />
                </motion.div>
            )}
        </main>
    </div>
  );
}