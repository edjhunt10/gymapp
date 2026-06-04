"use client";

import { useStore } from "@/lib/store";
import { Card, PageTitle, Stat } from "@/components/ui/primitives";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid,
} from "recharts";
import { epley1RM, startOfDay } from "@/lib/utils";
import { TrendingUp, Trophy, Award } from "lucide-react";

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const workouts = useStore((s) => s.workouts);
  const exercises = useStore((s) => s.exercises);
  const [selectedExId, setSelectedExId] = useState<string>("");

  // Exercises that have been logged
  const loggedExercises = useMemo(() => {
    const ids = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) {
        if (e.sets.some((s) => s.completed)) ids.add(e.exerciseId);
      }
    }
    return exercises.filter((e) => ids.has(e.id));
  }, [workouts, exercises]);

  useEffect(() => {
    if (!selectedExId && loggedExercises.length > 0) {
      setSelectedExId(loggedExercises[0].id);
    }
  }, [loggedExercises, selectedExId]);

  // Volume per workout over time
  const volumeData = useMemo(() => {
    return workouts
      .slice()
      .reverse()
      .map((w) => {
        const volume = w.exercises.reduce(
          (acc, e) =>
            acc + e.sets.filter((s) => s.completed).reduce((a, s) => a + s.weight * s.reps, 0),
          0
        );
        return {
          date: new Date(w.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          volume: Math.round(volume),
          ts: w.startedAt,
        };
      });
  }, [workouts]);

  // e1RM progress for selected exercise
  const e1rmData = useMemo(() => {
    if (!selectedExId) return [];
    const points: { date: string; e1rm: number; ts: number }[] = [];
    for (const w of workouts.slice().reverse()) {
      let bestE1rm = 0;
      for (const e of w.exercises) {
        if (e.exerciseId !== selectedExId) continue;
        for (const s of e.sets) {
          if (!s.completed || s.type === "warmup") continue;
          const e1 = epley1RM(s.weight, s.reps);
          if (e1 > bestE1rm) bestE1rm = e1;
        }
      }
      if (bestE1rm > 0) {
        points.push({
          date: new Date(w.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          e1rm: Math.round(bestE1rm * 10) / 10,
          ts: w.startedAt,
        });
      }
    }
    return points;
  }, [workouts, selectedExId]);

  // Personal Records
  const prs = useMemo(() => {
    const records: Record<string, { weight: number; reps: number; e1rm: number; date: number; exName: string }> = {};
    for (const w of workouts) {
      for (const e of w.exercises) {
        for (const s of e.sets) {
          if (!s.completed || s.type === "warmup") continue;
          const e1 = epley1RM(s.weight, s.reps);
          const cur = records[e.exerciseId];
          if (!cur || e1 > cur.e1rm) {
            const exName = exercises.find((x) => x.id === e.exerciseId)?.name ?? "—";
            records[e.exerciseId] = { weight: s.weight, reps: s.reps, e1rm: e1, date: w.startedAt, exName };
          }
        }
      }
    }
    return Object.entries(records)
      .sort((a, b) => b[1].e1rm - a[1].e1rm)
      .slice(0, 8);
  }, [workouts, exercises]);

  // Weekly sets per muscle
  const muscleData = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const counts: Record<string, number> = {};
    for (const w of workouts) {
      if (w.startedAt < sevenDaysAgo) continue;
      for (const e of w.exercises) {
        const ex = exercises.find((x) => x.id === e.exerciseId);
        if (!ex) continue;
        const completedSets = e.sets.filter((s) => s.completed && s.type !== "warmup").length;
        counts[ex.primary] = (counts[ex.primary] || 0) + completedSets;
      }
    }
    return Object.entries(counts)
      .map(([muscle, sets]) => ({ muscle, sets }))
      .sort((a, b) => b.sets - a.sets);
  }, [workouts, exercises]);

  if (!mounted) return null;

  const totalVolume = workouts.reduce(
    (acc, w) =>
      acc + w.exercises.reduce(
        (a, e) => a + e.sets.filter((s) => s.completed).reduce((b, s) => b + s.weight * s.reps, 0),
        0
      ),
    0
  );

  return (
    <div className="space-y-4">
      <PageTitle sub="Volume, PRs, and strength curves">Progress</PageTitle>

      <div className="grid grid-cols-3 gap-3">
        <Card><Stat label="Sessions" value={workouts.length} accent /></Card>
        <Card><Stat label="Volume (t)" value={(totalVolume / 1000).toFixed(1)} /></Card>
        <Card><Stat label="PRs" value={prs.length} /></Card>
      </div>

      {/* Volume chart */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold flex items-center gap-2">
            <TrendingUp size={16} className="text-accent" /> Volume Trend
          </h3>
          <span className="text-xs text-muted">last {volumeData.length} sessions</span>
        </div>
        {volumeData.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">Log a workout to see your trend.</p>
        ) : (
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: "#f5f5f5" }}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#d4ff3a"
                  strokeWidth={2}
                  dot={{ fill: "#d4ff3a", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Per-exercise e1RM */}
      <Card>
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-display font-bold">Estimated 1RM</h3>
          <select
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            className="bg-elevated border border-border rounded px-2 py-1 text-sm outline-none focus:border-accent"
          >
            {loggedExercises.length === 0 && <option>—</option>}
            {loggedExercises.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        {e1rmData.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">No data yet.</p>
        ) : (
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={e1rmData}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="e1rm"
                  stroke="#d4ff3a"
                  strokeWidth={2}
                  dot={{ fill: "#d4ff3a", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Weekly muscle distribution */}
      {muscleData.length > 0 && (
        <Card>
          <h3 className="font-display font-bold mb-3">Last 7 Days — Sets per Muscle</h3>
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={muscleData}>
                <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
                <XAxis dataKey="muscle" stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b6b6b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }}
                />
                <Bar dataKey="sets" fill="#d4ff3a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Personal Records */}
      <Card>
        <h3 className="font-display font-bold mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-accent" /> Personal Records
        </h3>
        {prs.length === 0 ? (
          <p className="text-muted text-sm text-center py-4">No PRs yet — get after it.</p>
        ) : (
          <div className="space-y-2">
            {prs.map(([id, pr]) => (
              <div key={id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-semibold text-sm">{pr.exName}</div>
                  <div className="text-xs text-muted">
                    {pr.weight}kg × {pr.reps} · e1RM {Math.round(pr.e1rm)}kg
                  </div>
                </div>
                <Award size={16} className="text-accent" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
