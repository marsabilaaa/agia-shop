import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default async function ConversationsPage() {
  const supabase = await createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `
      id,
      session_id,
      created_at,
      updated_at,
      messages (
        id,
        role,
        content,
        created_at
      )
    `,
    )
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Rekap Percakapan</h2>
        <p className="text-slate-500 text-sm mt-1">
          {conversations?.length ?? 0} percakapan tercatat
        </p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <div className="text-center py-20 text-slate-400 space-y-3">
          <MessageSquare className="h-12 w-12 mx-auto text-slate-300" />
          <p>Belum ada percakapan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => {
            const msgs = conv.messages ?? [];
            const lastMsg = msgs[msgs.length - 1];

            return (
              <div
                key={conv.id}
                className="bg-white rounded-xl border overflow-hidden"
              >
                {/* Conversation Header */}
                <div className="px-5 py-3 bg-slate-50 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-500 truncate max-w-[200px]">
                      {conv.session_id}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {msgs.length} pesan
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(conv.updated_at)}
                  </div>
                </div>

                {/* Messages */}
                <div className="divide-y max-h-80 overflow-y-auto">
                  {msgs.length === 0 ? (
                    <p className="text-sm text-slate-400 px-5 py-4">
                      Tidak ada pesan
                    </p>
                  ) : (
                    msgs.map((msg) => (
                      <div key={msg.id} className="px-5 py-3 flex gap-3">
                        <Badge
                          variant={
                            msg.role === "user" ? "default" : "secondary"
                          }
                          className="text-xs shrink-0 h-fit mt-0.5"
                        >
                          {msg.role === "user" ? "User" : "AI"}
                        </Badge>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
