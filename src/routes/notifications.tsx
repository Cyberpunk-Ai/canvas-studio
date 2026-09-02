import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, UserPlus, MessageCircle, Repeat2, AtSign, Radio, CheckCheck } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { DefaultRail } from "@/components/social/RightRail";
import { getProfile, notifications as seed, timeAgo, type Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Lumen" },
      {
        name: "description",
        content: "Every like, follow, reply, repost and Space invite from your Lumen community in one calm timeline.",
      },
      { property: "og:title", content: "Notifications — Lumen" },
      { property: "og:description", content: "Likes, follows, replies and Space invites from your Lumen community." },
    ],
  }),
  component: NotificationsPage,
});

const meta: Record<Notification["type"], { icon: typeof Heart; tint: string }> = {
  like: { icon: Heart, tint: "from-rose-400 to-pink-500" },
  follow: { icon: UserPlus, tint: "from-violet-400 to-brand" },
  comment: { icon: MessageCircle, tint: "from-sky-400 to-blue-500" },
  repost: { icon: Repeat2, tint: "from-emerald-400 to-teal-500" },
  mention: { icon: AtSign, tint: "from-amber-400 to-orange-500" },
  space: { icon: Radio, tint: "from-fuchsia-400 to-brand-pink" },
};

const filters = ["All", "Mentions", "Follows", "Likes"] as const;

function match(n: Notification, f: (typeof filters)[number]) {
  if (f === "All") return true;
  if (f === "Mentions") return n.type === "mention" || n.type === "comment";
  if (f === "Follows") return n.type === "follow";
  return n.type === "like" || n.type === "repost";
}

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const unread = items.filter((n) => !n.read).length;
  const visible = items.filter((n) => match(n, filter));

  return (
    <AppShell title="Notifications" right={<DefaultRail />}>
      <PageHeader
        title="Notifications"
        subtitle={unread ? `${unread} new since you last looked` : "You're all caught up"}
        action={
          <button
            onClick={() => setItems((i) => i.map((n) => ({ ...n, read: true })))}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-all duration-300 hover:shadow-soft active:scale-95"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        }
      />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 active:scale-95",
              filter === f
                ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                : "border border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {visible.map((n, i) => {
          const actor = getProfile(n.actor_id);
          const { icon: Icon, tint } = meta[n.type];
          return (
            <button
              key={n.id}
              onClick={() =>
                setItems((all) => all.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
              }
              style={{ animationDelay: `${i * 45}ms` }}
              className={cn(
                "glass-panel flex w-full animate-in fade-in slide-in-from-bottom-3 items-start gap-3.5 rounded-3xl p-4 text-left duration-500 transition-all hover:-translate-y-0.5 hover:shadow-lift",
                !n.read && "ring-1 ring-brand/20",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                  tint,
                )}
              >
                <Icon className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <Avatar name={actor.display_name} className="h-7 w-7 text-[0.6rem]" />
                  <span className="truncate text-sm font-bold">{actor.display_name}</span>
                  <span className="truncate text-xs text-muted-foreground">@{actor.username}</span>
                  <span className="ml-auto shrink-0 text-[0.65rem] text-muted-foreground">
                    {timeAgo(n.created_at)}
                  </span>
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                  {n.body}
                </span>
              </span>
              {!n.read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-brand to-brand-pink" />
              )}
            </button>
          );
        })}

        {visible.length === 0 && (
          <Panel className="text-center">
            <p className="text-sm font-semibold">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When people react to your posts, it shows up in this tab.
            </p>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
