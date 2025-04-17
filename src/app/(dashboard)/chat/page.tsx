// src/app/(dashboard)/chat-area/page.tsx
import ChatInterface from "@/components/store/ChatInterface";
import { ChatLight } from "@/components/store/Icon";

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="h-[60px] items-center lg:pl-14 hidden lg:block">
        <h2 className="text-md font-semibold flex items-center pt-3">
          <ChatLight className="mr-2 h-5 w-5 text-[#D1376A]" />
          Decision Thought Partner
        </h2>
        <p className="text-muted-foreground text-sm ml-2">
        Work through decisions, reflect on outcomes, and gain personal insights.
        </p>
      </div>
      <div className="flex-1 h-[calc(100vh-62px)]">
        <ChatInterface />
      </div>
    </div>
  );
}