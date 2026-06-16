"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { cn } from "@/lib/utils";

function generateSessionId() {
  // Cek localStorage dulu, kalau ada pakai yang lama (biar history lanjut)
  const stored = localStorage.getItem("chat_session_id");
  if (stored) return stored;
  const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("chat_session_id", newId);
  return newId;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  if (!sessionId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      <div
        className={cn(
          "w-full max-w-[360px] h-[520px] bg-[var(--surface-card)] rounded-2xl shadow-2xl border border-[var(--surface-border)] transition-all duration-300 overflow-hidden sm:w-[360px]",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        {open && <ChatWindow sessionId={sessionId} />}
      </div>

      {/* Toggle Button */}
      <Button
        size="icon"
        className="btn-brand h-14 w-14 rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
