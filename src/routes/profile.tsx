import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Link2,
  MapPin,
  Settings as SettingsIcon,
  Share2,
} from "lucide-react";
import { AppShell, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { PostCard } from "@/components/social/PostCard";
import { DefaultRail } from "@/components/social/RightRail";
import { compact, currentUser, posts, profiles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `${currentUser.display_name} (@${currentUser.username}) — Lumen` },
      { name: "description", content: currentUser.bio },
      { property: "og:title", content: `${currentUser.display_name} on Lumen` },
      { property: "og:description", content: currentUser.bio },
    ],
  }),
  component: ProfilePage,
});

const tabs = ["Posts", "Replies", "Media", "Likes"] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Posts");

  const mine = posts.filter((p) => p.user_id === currentUser.id);
  const liked = posts.filter((p) => p.likedByMe);
  const media = posts.filter((p) => p.image_gradient);
  const list = tab === "Posts" ? mine : tab === "Likes" ? liked : tab === "Media" ? media : [];

  const stats = [
    { label: "Posts", value: compact(mine.length + 128) },
    { label: "Followers", value: compact(currentUser.followers) },
    { label: "Following", value: compact(currentUser.following) },
  ];

  return (
    <AppShell title="Profile" right={<DefaultRail />}>
      <Panel className="overflow-hidden p-0">
        <div className="relative h-40 bg-gradient-to-tr from-brand via-brand-pink to-brand-orange sm:h-52">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
        </div>
        <div className="px-5 pb-5 sm:px-7">
          <div className="-mt-12 flex items-end justify-between gap-3">
            <span className="rounded-3xl bg-card p-1.5 shadow-lift">
              <Avatar name={currentUser.display_name} className="h-24 w-24 rounded-2xl text-2xl" />
            </span>
            <div className="mb-2 flex gap-2">
              <button
                aria-label="Share profile"
                className="rounded-full border border-border bg-card p-2.5 transition-all duration-300 hover:shadow-soft active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-pink px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow active:scale-95">
                <SettingsIcon className="h-4 w-4" /> Edit profile
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              {currentUser.display_name}
              {currentUser.verified && <BadgeCheck className="h-5 w-5 text-brand" />}
            </h1>
            <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed">{currentUser.bio}</p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {currentUser.location}
              </span>
              <span className="flex items-center gap-1.5 text-brand">
                <Link2 className="h-4 w-4" /> {currentUser.website}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Joined March 2021
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-foreground/[0.04] p-3 text-center transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <p className="text-lg font-extrabold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex -space-x-2">
                {profiles.slice(1, 5).map((p) => (
                  <Avatar
                    key={p.id}
                    name={p.display_name}
                    className="h-7 w-7 border-2 border-card text-[0.6rem]"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Followed by Clara, Marcus and 12 others you know
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="sticky top-2 z-20 my-5 flex gap-1 rounded-full border border-border bg-card/80 p-1 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-bold transition-all duration-300",
              tab === t
                ? "bg-gradient-to-r from-brand to-brand-pink text-white shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}
        {list.length === 0 && (
          <Panel className="py-12 text-center">
            <p className="text-sm font-semibold">No {tab.toLowerCase()} yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This tab fills up as you use Lumen.
            </p>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
