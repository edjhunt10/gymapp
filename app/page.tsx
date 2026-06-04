"use client";

import Link from "next/link";
import { useStore, selectTodayEntries, computeMacrosForEntries } from "@/lib/store";
import { Button, Card, ProgressBar, Stat } from "@/components/ui/primitives";
import { Plus, Zap, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeWorkout = useStore((s) => s.activeWorkout);
  const workouts = useStore((s) => s.workouts);
  const foodEntries = useStore((s) => s.foodEntries);
  const foods = useStore((s) => s.foods);
  const targets = useStore((s) => s.macroTargets);
  const templates = useStore((s) => s.templates);
  const startWorkout = useStore((s) => s.startWorkout);

  if (!mounted) return null;

  const today = selectTodayEntries({ foodEntries } as any);
  const macros = computeMacrosForEntries(today, foods);
  const lastWorkout = workouts[0];

  const thisWeek = workouts.filter(
    (w) => w.startedAt > Date.now() - 7 * 86400000
  ).length;

  return (
    <div className="space-y-6">
      <header className="slide-up">
        <p className="text-muted text-xs uppercase tracking-widest">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight mt-1">
          Iron<span className="text-accent">.</span>
        </h1>
      </header>

      {activeWorkout ? (
        <Link href="/workouts/active">
          <Card className="border-accent/40 bg-accent/5 hover:bg-accent/10 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center pulse-ring">
                <Activity size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-accent font-semibold">In progress</div>
                <div className="font-display font-bold text-lg">{activeWorkout.name}</div>
              </div>
              <div className="font-mono text-sm text-muted">
                {formatDuration(Date.now() - activeWorkout.startedAt)}
              </div>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display font-bold text-lg">Start a workout</div>
              <div className="text-muted text-sm">Empty session, or pick a template below.</div>
            </div>
            <Button onClick={() => startWorkout()} size="md">
              <Plus size={16} /> Start
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card><Stat label="This week" value={thisWeek} accent /></Card>
        <Card><Stat label="Total" value={workouts.length} /></Card>
        <Card>
          <Stat
            label="Last"
            value={
              lastWorkout
                ? new Date(lastWorkout.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                : "—"
            }
          />
        </Card>
      </div>

      {/* Macro snapshot */}
      <Link href="/macros">
        <Card className="hover:border-border/80 cursor-pointer transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Today's Macros</h2>
            <span className="text-xs text-muted">tap to log →</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <MacroCell label="kcal" value={Math.round(macros.kcal)} target={targets.kcal} />
            <MacroCell label="P" value={Math.round(macros.protein)} target={targets.protein} unit="g" color="blue" />
            <MacroCell label="C" value={Math.round(macros.carbs)} target={targets.carbs} unit="g" color="orange" />
            <MacroCell label="F" value={Math.round(macros.fat)} target={targets.fat} unit="g" color="pink" />
          </div>
        </Card>
      </Link>

      {/* Templates */}
      {templates.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <Zap size={18} className="text-accent" /> Your Templates
          </h2>
          <div className="space-y-2">
            {templates.slice(0, 3).map((t) => (
              <Card key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted">{t.exercises.length} exercises</div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    startWorkout(undefined, t.id);
                    window.location.href = "/workouts/active";
                  }}
                >
                  Start
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MacroCell({
  label, value, target, unit, color = "accent",
}: { label: string; value: number; target: number; unit?: string; color?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="font-mono font-bold text-lg">{value}</span>
        <span className="text-muted text-xs">/{target}{unit}</span>
      </div>
      <ProgressBar value={value} max={target} color={color} />
      <div className="text-[10px] uppercase tracking-wider text-muted mt-1">{label}</div>
    </div>
  );
}
