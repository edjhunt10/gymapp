"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded select-none active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
      size === "sm" && "h-9 px-3 text-sm",
      size === "md" && "h-11 px-4 text-sm",
      size === "lg" && "h-14 px-6 text-base",
      variant === "primary" && "bg-accent text-bg hover:bg-accent-dim",
      variant === "secondary" && "bg-elevated text-text hover:bg-border border border-border",
      variant === "ghost" && "text-text hover:bg-elevated",
      variant === "danger" && "bg-danger/15 text-danger hover:bg-danger/25 border border-danger/30",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-lg p-4",
        className
      )}
      {...props}
    />
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full bg-elevated border border-border rounded px-3 text-text font-mono text-base outline-none focus:border-accent transition-colors",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs uppercase tracking-wider text-muted font-medium", className)}
      {...props}
    />
  );
}

export function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted mb-1">{label}</div>
      <div className={cn("font-display font-bold text-2xl", accent && "text-accent")}>{value}</div>
    </div>
  );
}

export function PageTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6 slide-up">
      <h1 className="font-display text-3xl font-bold tracking-tight">{children}</h1>
      {sub && <p className="text-muted text-sm mt-1">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, max, color = "accent" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 bg-elevated rounded-full overflow-hidden">
      <div
        className={cn(
          "h-full transition-all duration-500 rounded-full",
          color === "accent" && "bg-accent",
          color === "blue" && "bg-blue-400",
          color === "orange" && "bg-orange-400",
          color === "pink" && "bg-pink-400"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
