import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/website_logo.svg.asset.json";
import { Badge, Button, PageContainer } from "@/components/kit";
import { cn } from "@/lib/utils";

export function SocietyLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Sai Bhawani CHS Ltd logo"
      className={cn("h-12 w-12 rounded-full object-contain", className)}
    />
  );
}

export type NavItem = { label: string; to?: LinkProps["to"]; exact?: boolean };

const navItemClass =
  "block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors";
const navInactive = "text-muted-foreground hover:bg-secondary hover:text-foreground";
const navActive = "bg-primary text-primary-foreground";

export function DashboardLayout({
  role,
  navItems,
  children,
}: {
  role: string;
  navItems: NavItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const nav = (
    <nav className="space-y-1" onClick={() => setOpen(false)}>
      {navItems.map((item, i) =>
        item.to ? (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.exact ?? false }}
            className={cn(navItemClass, navInactive)}
            activeProps={{ className: cn(navItemClass, navActive) }}
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            className={cn(navItemClass, i === 0 ? navActive : navInactive)}
          >
            {item.label}
          </button>
        ),
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="px-2 lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl leading-none">☰</span>
          </Button>
          <SocietyLogo className="h-10 w-10" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-xl leading-tight text-primary">SAI BHAWANI CHS LTD</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Society Management System</p>
          </div>
          <Badge variant="gold">{role}</Badge>
          <Button variant="outline" onClick={() => navigate({ to: "/login" })}>
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 sm:px-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 py-8 lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
            {nav}
          </div>
        </aside>
        {open ? (
          <div className="fixed inset-x-0 top-[65px] z-10 border-b border-border bg-card p-3 lg:hidden">{nav}</div>
        ) : null}
        <main className="min-w-0 flex-1">
          <PageContainer className="px-0 sm:px-0 lg:px-0">{children}</PageContainer>
        </main>
      </div>

      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sai Bhawani CHS Ltd ·{" "}
        <Link to="/login" className="hover:text-primary">
          Sign in
        </Link>
      </footer>
    </div>
  );
}

export function PlaceholderGrid({ items }: { items: NavItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl text-primary">{item.label}</h3>
            <Badge variant="muted">Coming soon</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            This module will be available in an upcoming release.
          </p>
        </div>
      ))}
    </div>
  );
}
