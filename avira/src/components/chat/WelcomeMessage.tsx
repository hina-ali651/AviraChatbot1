import { Sparkles } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { motion } from "framer-motion";

interface WelcomeMessageProps {
  userName?: string;
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  isLoading: boolean;
}

export function WelcomeMessage({ 
  userName = "User", 
  input, 
  setInput, 
  handleSend, 
  isLoading 
}: WelcomeMessageProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full px-2 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Welcome Content */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center px-4 mb-12">
        <motion.div 
          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-10 h-10 text-white drop-shadow-lg animate-pulse" />
        </motion.div>
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(236,72,153,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Hello, {userName}!
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            I&apos;m Avira, your AI assistant. How can I help you today?
          </motion.p>
        </motion.div>
      </div>

      {/* Input Box Below Welcome Message */}
      <motion.div 
        className="w-full max-w-2xl sm:max-w-4xl mx-auto px-2 sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  );
}