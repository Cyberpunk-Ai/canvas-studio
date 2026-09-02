import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User as UserIcon,
  Bell,
  Lock,
  Palette,
  Globe,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/social/AppShell";
import { Avatar } from "@/components/social/Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Lumen" },
      {
        name: "description",
        content: "Manage your Lumen profile, notification preferences, privacy controls and appearance.",
      },
      { property: "og:title", content: "Settings — Lumen" },
      { property: "og:description", content: "Profile, notifications, privacy and appearance controls for Lumen." },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { id: "account", label: "Account", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language & region", icon: Globe },
] as const;

function Toggle({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl p-3 transition-colors hover:bg-foreground/[0.03]">
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-all duration-300",
          on ? "bg-gradient-to-r from-brand to-brand-pink" : "bg-foreground/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300",
            on ? "left-[1.4rem]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex w-full items-center justify-between gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-foreground/[0.03]">
      <span className="text-sm font-bold">{label}</span>
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {value} <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function SettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("account");

  return (
    <AppShell title="Settings">
      <PageHeader title="Settings" subtitle="Tune Lumen until it feels like yours." />

      <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
        <Panel className="h-fit p-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                  active === s.id
                    ? "bg-gradient-to-r from-brand/12 to-brand-pink/12 text-brand"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> {s.label}
              </button>
            );
          })}
          <button
            onClick={() => toast("Sign-out arrives with the backend")}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </Panel>

        <div className="space-y-4">
          {active === "account" && (
            <Panel>
              <h2 className="text-lg font-extrabold tracking-tight">Your profile</h2>
              <div className="mt-4 flex items-center gap-4">
                <Avatar name={currentUser.display_name} className="h-16 w-16 rounded-2xl text-lg" />
                <button className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-all duration-300 hover:shadow-soft active:scale-95">
                  Change photo
                </button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Display name", value: currentUser.display_name },
                  { label: "Username", value: currentUser.username },
                  { label: "Location", value: currentUser.location },
                  { label: "Website", value: currentUser.website },
                ].map((f) => (
                  <label key={f.label} className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </span>
                    <input
                      defaultValue={f.value}
                      className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none transition-all duration-300 focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
                    />
                  </label>
                ))}
              </div>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Bio
                </span>
                <textarea
                  defaultValue={currentUser.bio}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm outline-none transition-all duration-300 focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
                />
              </label>
              <button
                onClick={() => toast.success("Profile saved")}
                className="mt-4 rounded-full bg-gradient-to-r from-brand to-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow active:scale-95"
              >
                Save changes
              </button>
            </Panel>
          )}

          {active === "notifications" && (
            <Panel>
              <h2 className="mb-2 text-lg font-extrabold tracking-tight">Notifications</h2>
              <Toggle label="Likes and reposts" description="When someone reacts to your posts." defaultOn />
              <Toggle label="New followers" description="When someone starts following you." defaultOn />
              <Toggle label="Replies and mentions" description="When you're pulled into a thread." defaultOn />
              <Toggle label="Space invites" description="When a host invites you to speak." />
              <Toggle label="Email digest" description="A weekly summary of what you missed." />
            </Panel>
          )}

          {active === "privacy" && (
            <Panel>
              <h2 className="mb-2 text-lg font-extrabold tracking-tight">Privacy</h2>
              <Toggle label="Private account" description="Only approved followers see your posts." />
              <Toggle label="Hide read receipts" description="Don't show when you've read a message." />
              <Toggle label="Allow message requests" description="Let anyone start a conversation." defaultOn />
              <Toggle label="Discoverable by email" description="People can find you with your email." defaultOn />
            </Panel>
          )}

          {active === "appearance" && (
            <Panel>
              <h2 className="mb-3 text-lg font-extrabold tracking-tight">Appearance</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Light", "Dark", "System"].map((t, i) => (
                  <button
                    key={t}
                    className={cn(
                      "rounded-2xl border p-4 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft",
                      i === 0 ? "border-brand/40 ring-4 ring-brand/10" : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "mb-3 block h-14 rounded-xl",
                        i === 0 ? "bg-gradient-to-br from-slate-100 to-white" : i === 1 ? "bg-gradient-to-br from-slate-800 to-slate-950" : "bg-gradient-to-br from-slate-100 via-slate-400 to-slate-900",
                      )}
                    />
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Toggle label="Reduced motion" description="Soften animations across the app." />
                <Toggle label="Larger text" description="Increase base font size for readability." />
              </div>
            </Panel>
          )}

          {active === "language" && (
            <Panel>
              <h2 className="mb-2 text-lg font-extrabold tracking-tight">Language & region</h2>
              <Row label="App language" value="English (UK)" />
              <Row label="Content languages" value="English, Português" />
              <Row label="Time zone" value="Europe/Lisbon" />
              <Row label="Date format" value="DD/MM/YYYY" />
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
