import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  sender: "user" | "assistant" | "error";
  text: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isError = message.sender === "error";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div 
        className={`flex items-start gap-2 md:gap-3 max-w-[90%] md:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {message.sender === "assistant" && (
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
        )}
        {message.sender === "user" && (
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-[0_0_20px_rgba(75,85,99,0.3)] flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-6 h-6 text-white" />
          </motion.div>
        )}
        <motion.div
          className={`p-3 md:p-4 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
              : isError
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-[0_0_20px_rgba(31,41,55,0.3)]"
          } transition-all duration-300 text-sm md:text-base break-words whitespace-pre-wrap overflow-x-auto`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {message.text}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}