import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { PostCard } from "@/components/social/PostCard";
import { DefaultRail } from "@/components/social/RightRail";
import { getProfile, posts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — Lumen" },
      {
        name: "description",
        content: "Everything you saved on Lumen, kept private and searchable so you can come back to it later.",
      },
      { property: "og:title", content: "Bookmarks — Lumen" },
      { property: "og:description", content: "Your private, searchable collection of saved Lumen posts." },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const [query, setQuery] = useState("");
  const saved = posts.filter((p) => p.bookmarkedByMe);
  const q = query.trim().toLowerCase();
  const visible = saved.filter(
    (p) =>
      !q ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      getProfile(p.user_id).display_name.toLowerCase().includes(q),
  );

  return (
    <AppShell title="Bookmarks" right={<DefaultRail />}>
      <PageHeader
        title="Bookmarks"
        subtitle={`${saved.length} saved ${saved.length === 1 ? "post" : "posts"} — only you can see these`}
      />

      <div className="group relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your bookmarks"
          className="glass-panel h-12 w-full rounded-full pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:shadow-soft focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className={cn("space-y-4")}>
        {visible.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}

        {visible.length === 0 && (
          <Panel className="flex flex-col items-center py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-pink text-white shadow-soft">
              <Bookmark className="h-6 w-6" />
            </span>
            <p className="mt-4 text-lg font-bold">Nothing saved yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Tap the bookmark icon on any post and it lands here — private, organised and easy to
              find again.
            </p>
            <Link
              to="/feed"
              className="mt-5 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow active:scale-95"
            >
              Browse your feed
            </Link>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
