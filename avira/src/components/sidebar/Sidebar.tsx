import { Search, Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

type Chat = {
  id: string;
  subject: string;
  messages: any[];
};

interface SidebarProps {
  onNewChat: () => void;
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ onNewChat, chats, currentChatId, onSelectChat }: SidebarProps) {
  return (
    <motion.aside 
      className="w-72 max-w-full h-screen border-r border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col shadow-[0_0_30px_rgba(31,41,55,0.3)] fixed md:static z-50 left-0 top-0 md:translate-x-0 transition-transform duration-300"
      initial={false}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
    >
      <motion.div 
        className="p-4 border-b border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Avira
        </motion.h1>
      </motion.div>

      <motion.div 
        className="p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <motion.input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent backdrop-blur-sm shadow-[0_0_20px_rgba(31,41,55,0.3)] transition-all duration-300"
            whileFocus={{ scale: 1.01 }}
          />
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button 
          className="w-full p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {chats.map((chat) => (
            <motion.button 
              key={chat.id}
              className={`w-full p-3 rounded-xl ${
                chat.id === currentChatId 
                  ? "bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30" 
                  : "bg-gradient-to-br from-gray-800 to-gray-900"
              } text-white hover:from-gray-700 hover:to-gray-800 shadow-[0_0_20px_rgba(31,41,55,0.3)] hover:shadow-[0_0_30px_rgba(31,41,55,0.4)] transition-all duration-300 flex items-center gap-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="truncate">{chat.subject}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        className="p-4 border-t border-gray-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button 
          className="w-full p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upgrade to Pro
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}