//src/components/store/ClientChatPage.tsx
'use client';
import ChatInterface from "@/components/store/ChatInterface";
import { ChatLight } from "@/components/store/Icon";
import { motion } from "framer-motion";

export default function ClientChatPage() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-[60px] items-center lg:pl-14 hidden lg:block"
      >
        <h2 className="text-md font-semibold flex items-center pt-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ChatLight className="mr-2 h-5 w-5 text-[#D1376A]" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Decision Thought Partner
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-muted-foreground text-sm ml-2"
        >
          Work through decisions, reflect on outcomes, and gain personal insights.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 h-[calc(100vh-62px)]"
      >
        <ChatInterface />
      </motion.div>
    </div>
  );
}