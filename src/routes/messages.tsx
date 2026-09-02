import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Send, Phone, Video, Info, ArrowLeft, Smile } from "lucide-react";
import { AppShell } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import {
  conversations as seedConversations,
  currentUserId,
  getProfile,
  messages as seedMessages,
  timeAgo,
  type Message,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Lumen" },
      {
        name: "description",
        content: "Private, fast conversations on Lumen — chat with the creators and friends you follow.",
      },
      { property: "og:title", content: "Messages — Lumen" },
      { property: "og:description", content: "Private, fast conversations with the people you follow on Lumen." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [activeId, setActiveId] = useState(seedConversations[0]!.id);
  const [thread, setThread] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = seedConversations.find((c) => c.id === activeId)!;
  const partner = getProfile(active.participant_id);

  const list = useMemo(
    () =>
      seedConversations.filter((c) => {
        const p = getProfile(c.participant_id);
        const q = query.toLowerCase();
        return (
          !q || p.display_name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
        );
      }),
    [query],
  );

  const visible = thread.filter((m) => m.conversation_id === activeId);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setThread((t) => [
      ...t,
      {
        id: `m_${Date.now()}`,
        conversation_id: activeId,
        sender_id: currentUserId,
        body,
        created_at: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <AppShell title="Messages">
      <div className="glass-panel grid h-[calc(100vh-9rem)] overflow-hidden rounded-3xl shadow-soft md:grid-cols-[19rem_1fr]">
        {/* list */}
        <div
          className={cn(
            "flex flex-col border-r border-border/60",
            mobileOpen ? "hidden md:flex" : "flex",
          )}
        >
          <div className="p-4">
            <div className="group relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages"
                className="h-11 w-full rounded-full bg-foreground/5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-brand/25"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
            {list.map((c) => {
              const p = getProfile(c.participant_id);
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id);
                    setMobileOpen(true);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300",
                    isActive ? "bg-gradient-to-r from-brand/12 to-brand-pink/12" : "hover:bg-foreground/5",
                  )}
                >
                  <span className="relative shrink-0">
                    <Avatar name={p.display_name} className="h-11 w-11 text-xs" />
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">{p.display_name}</span>
                      <span className="shrink-0 text-[0.65rem] text-muted-foreground">
                        {timeAgo(c.updated_at)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-xs text-muted-foreground">{c.preview}</span>
                      {c.unread > 0 && (
                        <span className="ml-auto shrink-0 rounded-full bg-gradient-to-r from-brand to-brand-pink px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* thread */}
        <div className={cn("flex flex-col", mobileOpen ? "flex" : "hidden md:flex")}>
          <div className="flex items-center gap-3 border-b border-border/60 p-4">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Back to conversations"
              className="rounded-full p-2 hover:bg-foreground/5 md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Avatar name={partner.display_name} className="h-10 w-10 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{partner.display_name}</p>
              <p className="text-xs text-muted-foreground">
                {active.online ? "Active now" : `Active ${timeAgo(active.updated_at)}`}
              </p>
            </div>
            {[Phone, Video, Info].map((Icon, i) => (
              <button
                key={i}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                aria-label="Conversation action"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-width:thin]">
            {visible.map((m, i) => {
              const mine = m.sender_id === currentUserId;
              return (
                <div
                  key={m.id}
                  style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                  className={cn(
                    "flex animate-in fade-in slide-in-from-bottom-2 duration-500",
                    mine ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-soft transition-transform duration-300 hover:-translate-y-0.5",
                      mine
                        ? "rounded-br-lg bg-gradient-to-r from-brand to-brand-pink text-white"
                        : "rounded-bl-lg bg-card",
                    )}
                  >
                    {m.body}
                    <span
                      className={cn(
                        "mt-1 block text-[0.6rem]",
                        mine ? "text-white/70" : "text-muted-foreground",
                      )}
                    >
                      {timeAgo(m.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border/60 p-3">
            <button
              type="button"
              aria-label="Add emoji"
              className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${partner.display_name.split(" ")[0]}`}
              className="h-11 flex-1 rounded-full bg-foreground/5 px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-brand/25"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-pink text-white transition-all duration-300 hover:shadow-glow active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
