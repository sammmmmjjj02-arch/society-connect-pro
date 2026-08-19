import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/components/kit";
import { SocietyLogo } from "@/components/society-layout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Sai Bhawani CHS Ltd" },
      {
        name: "description",
        content: "Sign in to the Sai Bhawani CHS Ltd portal as a resident, watchman or administrator.",
      },
      { property: "og:title", content: "Login — Sai Bhawani CHS Ltd" },
      { property: "og:description", content: "Sign in to the Sai Bhawani CHS Ltd society portal." },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { id: "resident", label: "Resident", to: "/resident" },
  { id: "watchman", label: "Watchman", to: "/watchman" },
  { id: "admin", label: "Admin", to: "/admin" },
] as const;

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<(typeof roles)[number]>(roles[0]);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({ to: role.to });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-8">
      <div className="w-full max-w-md animate-soft-fade">
        <div className="mb-6 flex flex-col items-center text-center">
          <SocietyLogo className="h-16 w-16" />
          <h1 className="mt-3 font-heading text-3xl font-semibold text-primary">SAI BHAWANI CHS LTD</h1>
          <div className="mt-2 h-px w-24 bg-accent" />
          <p className="mt-2 text-sm text-muted-foreground">Society Management System</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <p className="mb-2 text-sm font-medium text-foreground">Login as</p>
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-secondary p-1">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role.id === r.id}
                className={cn(
                  "rounded-md px-2 py-2.5 text-sm font-medium transition-colors",
                  role.id === r.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Input
              id="username"
              label="Username or Email"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              required
            />
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              trailing={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 px-3 text-xs"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              }
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button type="button" className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
          </div>

          <Button type="submit" size="lg" className="mt-5 w-full">
            Login as {role.label}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          For assistance, please contact the society office.
        </p>
      </div>
    </div>
  );
}
