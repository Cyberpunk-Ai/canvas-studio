import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or Join — Lumen" },
      {
        name: "description",
        content:
          "Create your Lumen account or sign back in to your feed, live Spaces, saved posts and private conversations.",
      },
      { property: "og:title", content: "Sign in or Join — Lumen" },
      {
        property: "og:description",
        content: "Sign in to Lumen and pick up your feed, Spaces and conversations right where you left off.",
      },
    ],
  }),
  component: AuthPage,
});

const perks = [
  "A feed tuned to what you actually care about",
  "Live Spaces with crystal-clear audio",
  "Private, fast conversations",
];

function Field({
  icon: Icon,
  ...props
}: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="group relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-11 text-sm outline-none transition-all duration-300 focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(mode === "signin" ? "Welcome back to Lumen" : "Your Lumen account is ready");
      navigate({ to: "/feed" });
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="animate-float absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-300 blur-[140px]" />
        <div className="absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-pink-300 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:gap-16">
        {/* pitch */}
        <div className="hidden lg:block">
          <Link to="/" className="mb-10 inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-pink">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">Lumen</span>
          </Link>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
            Where your world
            <br />
            <span className="gradient-text">comes to life.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Join a calmer social home built for creators, conversation and communities that actually
            talk to each other.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-pink">
                  <Check className="h-3.5 w-3.5 text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* card */}
        <div className="glass-panel mx-auto w-full max-w-md rounded-[2rem] p-7 shadow-lift sm:p-9">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-pink">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Lumen</span>
          </Link>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-foreground/5 p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full py-2.5 text-sm font-bold transition-all duration-300",
                  mode === m
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Make it yours"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to pick up right where you left off."
              : "It takes about thirty seconds."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <Field icon={UserIcon} placeholder="Display name" required autoComplete="name" />
            )}
            <Field icon={Mail} type="email" placeholder="you@email.com" required autoComplete="email" />
            <div className="relative">
              <Field
                icon={Lock}
                type={show ? "text" : "password"}
                placeholder="Password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-pink font-bold text-white shadow-soft transition-all duration-300 hover:shadow-glow active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {["Google", "Apple"].map((p) => (
              <button
                key={p}
                onClick={() => toast("Social sign-in arrives with the backend")}
                className="h-11 rounded-2xl border border-border bg-card text-sm font-semibold transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
              >
                Continue with {p}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
