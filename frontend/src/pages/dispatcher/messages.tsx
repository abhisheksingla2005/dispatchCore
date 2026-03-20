/**
 * Dispatcher Messages Page
 *
 * Real-time chat with drivers and recipients for all company orders.
 */

import { useSearchParams } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import ChatPanel from "@/components/chat/ChatPanel";
import type { ChatChannel } from "@/services/shared/messaging";

export default function MessagesPage() {
  const companyId = localStorage.getItem("dc_company_id");
  const userName = localStorage.getItem("dc_user_name") || "Dispatcher";
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("orderId")
    ? Number(searchParams.get("orderId"))
    : undefined;
  const initialChannel = searchParams.get("channel") as ChatChannel | undefined;

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <ChatPanel
          role="dispatcher"
          senderId={companyId ? Number(companyId) : null}
          senderName={userName}
          bubbleColor="bg-primary"
          bubbleText="text-white"
          initialOrderId={initialOrderId}
          initialChannel={initialChannel}
        />
      </main>
    </div>
  );
}
