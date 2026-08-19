import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Button ---------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "gold" | "ghost";
  size?: "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        size === "lg" ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" && "border border-border bg-card text-foreground hover:bg-secondary",
        variant === "gold" && "bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

/* ---------- Input ---------- */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  trailing?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, trailing, ...props }, ref) => (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25",
            trailing && "pr-12",
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        ) : null}
      </div>
    </div>
  ),
);
Input.displayName = "Input";

/* ---------- Card ---------- */
export function Card({
  className,
  children,
  title,
  subtitle,
}: {
  className?: string;
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]", className)}
    >
      {title ? (
        <header className="mb-4">
          <h3 className="text-2xl text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  variant = "navy",
  className,
}: {
  children: ReactNode;
  variant?: "navy" | "gold" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "navy" && "bg-primary/10 text-primary",
        variant === "gold" && "bg-accent/20 text-accent-foreground",
        variant === "muted" && "bg-secondary text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Page container ---------- */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8", className)}>{children}</div>;
}
