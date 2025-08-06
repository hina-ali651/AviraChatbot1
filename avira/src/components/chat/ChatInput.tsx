import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function ChatInput({ input, setInput, handleSend, isLoading, inputRef }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (inputRef && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading, inputRef]);
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <motion.div 
      className="p-4 bg-transparent backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-2 md:p-3 rounded-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent shadow-[0_0_20px_rgba(31,41,55,0.3)] transition-all duration-300 text-sm md:text-base bg-transparent"
          disabled={isLoading}
          whileFocus={{ scale: 1.01 }}
          ref={inputRef}
        />
        <motion.button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
        <motion.button
          className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 shadow-[0_0_20px_rgba(75,85,99,0.3)] hover:shadow-[0_0_30px_rgba(75,85,99,0.4)] transition-all duration-300 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Mic className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}