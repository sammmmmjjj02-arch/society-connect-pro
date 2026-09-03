import { useState, type ReactNode } from "react";
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { Badge, Button, PageContainer } from "@/components/kit";
import { cn } from "@/lib/utils";

export function SocietyLogo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="Sai Bhawani CHS Ltd logo"
      className={cn("h-12 w-12 rounded-full object-contain", className)}
    />
  );
}

export type NavItem = {
  label: string;
  to?: LinkProps["to"];
  exact?: boolean;
};

const navItemClass =
  "group flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200";

const navInactive =
  "text-muted-foreground hover:bg-primary/5 hover:text-primary";

const navActive =
  "bg-primary text-primary-foreground shadow-sm";

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
    <nav className="space-y-1">
      {navItems.map((item) =>
        item.to ? (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.exact ?? false }}
            onClick={() => setOpen(false)}
            className={cn(navItemClass, navInactive)}
            activeProps={{
              className: cn(navItemClass, navActive),
            }}
          >
            <span className="flex-1">{item.label}</span>
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              navItemClass,
              item === navItems[0] ? navActive : navInactive,
            )}
          >
            <span className="flex-1">{item.label}</span>
          </button>
        ),
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-20 border-b border-primary/10 bg-card/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="px-2 lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl leading-none">☰</span>
          </Button>

          <SocietyLogo className="h-10 w-10 shrink-0" />

          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-lg font-semibold leading-tight text-primary sm:text-xl">
              SAI BHAWANI CHS LTD
            </p>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Society Management System
            </p>
          </div>

          <Badge variant="gold">{role}</Badge>

          <Button
            variant="outline"
            className="hidden sm:inline-flex"
            onClick={() => navigate({ to: "/login" })}
          >
            Logout
          </Button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-x-0 top-[65px] z-30 border-b border-primary/10 bg-card p-3 shadow-lg lg:hidden">
          {nav}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 sm:px-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 py-8 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-xl border border-primary/10 bg-card shadow-[var(--shadow-card)]">
            <div className="border-b border-border bg-primary px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground/70">
                Menu
              </p>
              <p className="mt-1 font-heading text-xl text-primary-foreground">
                {role} Portal
              </p>
            </div>

            <div className="p-3">{nav}</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <PageContainer className="px-0 sm:px-0 lg:px-0">
            {children}
          </PageContainer>
        </main>
      </div>

      <footer className="mt-8 border-t border-primary/10 bg-primary px-4 py-8 text-center text-sm text-primary-foreground sm:px-6">
        <p className="font-heading text-xl">
          © {new Date().getFullYear()} Sai Bhawani CHS Ltd
        </p>

        <p className="mt-2 text-sm text-primary-foreground/70">
          Society Management System
        </p>

        <Link
          to="/login"
          className="mt-4 inline-flex rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
        >
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
          className="rounded-xl border border-primary/10 bg-card p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-lg"
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