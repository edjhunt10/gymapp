"use client";

import { useStore } from "@/lib/store";
import { Card, PageTitle, Button } from "@/components/ui/primitives";
import { Plus, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const workouts = useStore((s) => s.workouts);
  const exercises = useStore((s) => s.exercises);
  const activeWorkout = useStore((s) => s.activeWorkout);
  const startWorkout = useStore((s) => s.startWorkout);

  if (!mounted) return null;

  return (
    <div>
      <PageTitle sub={`${workouts.length} total sessions`}>History</PageTitle>

      {!activeWorkout && (
        <Button
          className="w-full mb-4"
          onClick={() => {
            startWorkout();
            window.location.href = "/workouts/active";
          }}
        >
          <Plus size={16} /> New Workout
        </Button>
      )}

      {activeWorkout && (
        <Link href="/workouts/active">
          <Card className="mb-4 border-accent/40 bg-accent/5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs uppercase tracking-wider text-accent">In progress</div>
                <div className="font-display font-bold">{activeWorkout.name}</div>
              </div>
              <Button size="sm">Resume →</Button>
            </div>
          </Card>
        </Link>
      )}

      <div className="space-y-3">
        {workouts.length === 0 && (
          <Card className="text-center py-12">
            <Dumbbell size={32} className="mx-auto text-muted mb-2" />
            <p className="text-muted text-sm">No workouts yet. Start your first session.</p>
          </Card>
        )}

        {workouts.map((w) => {
          const totalVolume = w.exercises.reduce(
            (acc, e) => acc + e.sets.filter((s) => s.completed).reduce((a, s) => a + s.weight * s.reps, 0),
            0
          );
          const sets = w.exercises.reduce(
            (acc, e) => acc + e.sets.filter((s) => s.completed).length,
            0
          );
          const duration = w.endedAt ? w.endedAt - w.startedAt : 0;
          return (
            <Card key={w.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display font-bold text-lg">{w.name}</div>
                  <div className="text-xs text-muted">
                    {new Date(w.startedAt).toLocaleDateString("en-GB", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{formatDuration(duration)}</div>
                </div>
              </div>
              <div className="flex gap-4 text-xs mb-3">
                <span><span className="font-mono text-accent">{w.exercises.length}</span> ex</span>
                <span><span className="font-mono text-accent">{sets}</span> sets</span>
                <span><span className="font-mono text-accent">{Math.round(totalVolume)}</span> kg vol</span>
              </div>
              <div className="text-xs text-muted space-y-1">
                {w.exercises.slice(0, 4).map((we) => {
                  const ex = exercises.find((e) => e.id === we.exerciseId);
                  const best = we.sets.filter((s) => s.completed).reduce(
                    (b, s) => (s.weight * s.reps > b.weight * b.reps ? s : b),
                    { weight: 0, reps: 0 }
                  );
                  return (
                    <div key={we.id} className="flex justify-between">
                      <span>{ex?.name ?? "—"}</span>
                      <span className="font-mono">
                        {we.sets.filter((s) => s.completed).length} × {best.weight}kg
                      </span>
                    </div>
                  );
                })}
                {w.exercises.length > 4 && (
                  <div className="text-muted/60 italic">+{w.exercises.length - 4} more</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
