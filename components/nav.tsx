"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, LineChart, Apple, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/workouts/history", icon: Dumbbell, label: "Workouts" },
  { href: "/progress", icon: LineChart, label: "Progress" },
  { href: "/macros", icon: Apple, label: "Macros" },
  { href: "/exercises", icon: BookOpen, label: "Library" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-bg/90 backdrop-blur border-t border-border">
      <div className="mx-auto max-w-2xl px-2 py-2 flex justify-around">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded transition-colors min-w-[60px]",
                active ? "text-accent" : "text-muted hover:text-text"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
