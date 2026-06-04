"use client";

import { useStore } from "@/lib/store";
import { Button, Card, Input } from "@/components/ui/primitives";
import { Plus, X, Check, Trash2, Search, Timer, Save } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDuration, epley1RM } from "@/lib/utils";
import type { SetType } from "@/lib/types";

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [tplName, setTplName] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const i = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const w = useStore((s) => s.activeWorkout);
  const exercises = useStore((s) => s.exercises);
  const startWorkout = useStore((s) => s.startWorkout);
  const endWorkout = useStore((s) => s.endWorkout);
  const cancelWorkout = useStore((s) => s.cancelWorkout);
  const addExerciseToWorkout = useStore((s) => s.addExerciseToWorkout);
  const saveTemplate = useStore((s) => s.saveTemplate);

  if (!mounted) return null;

  if (!w) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">No active workout.</p>
        <Button
          onClick={() => {
            startWorkout();
          }}
        >
          <Plus size={16} /> Start Empty Workout
        </Button>
      </div>
    );
  }

  const totalVolume = w.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.completed).reduce((a, s) => a + s.weight * s.reps, 0),
    0
  );
  const completedSets = w.exercises.reduce(
    (acc, e) => acc + e.sets.filter((s) => s.completed).length,
    0
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="sticky top-0 -mx-4 px-4 py-3 bg-bg/95 backdrop-blur z-10 border-b border-border slide-up">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={w.name}
            onChange={(e) =>
              useStore.setState({ activeWorkout: { ...w, name: e.target.value } })
            }
            className="font-display font-bold text-2xl bg-transparent outline-none flex-1"
          />
          <div className="font-mono text-sm text-accent">
            {formatDuration(Date.now() - w.startedAt)}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted mt-1">
          <span><span className="font-mono text-text">{completedSets}</span> sets</span>
          <span><span className="font-mono text-text">{Math.round(totalVolume)}</span> kg vol</span>
          <span><span className="font-mono text-text">{w.exercises.length}</span> exercises</span>
        </div>
      </div>

      <RestTimerBar />

      {/* Exercises */}
      <div className="space-y-3">
        {w.exercises.map((we) => (
          <ExerciseBlock key={we.id} workoutExId={we.id} />
        ))}
      </div>

      {/* Add exercise */}
      {showAdd ? (
        <ExercisePicker
          onPick={(id) => {
            addExerciseToWorkout(id);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      ) : (
        <Button variant="secondary" className="w-full" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Exercise
        </Button>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => setShowSaveTpl(true)}
          disabled={w.exercises.length === 0}
        >
          <Save size={16} /> Save as Template
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Cancel and discard this workout?")) {
              cancelWorkout();
              router.push("/");
            }
          }}
        >
          <X size={16} /> Cancel
        </Button>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          endWorkout();
          router.push("/workouts/history");
        }}
        disabled={completedSets === 0}
      >
        <Check size={18} /> Finish Workout
      </Button>

      {showSaveTpl && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-30 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md slide-up">
            <h3 className="font-display font-bold text-xl mb-3">Save as Template</h3>
            <Input
              placeholder="Template name"
              value={tplName}
              onChange={(e) => setTplName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setShowSaveTpl(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (!tplName.trim()) return;
                  saveTemplate({
                    name: tplName.trim(),
                    exercises: w.exercises.map((e) => ({
                      exerciseId: e.exerciseId,
                      targetSets: e.sets.length,
                    })),
                  });
                  setShowSaveTpl(false);
                  setTplName("");
                }}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function RestTimerBar() {
  const restTimer = useStore((s) => s.restTimer);
  const stopRest = useStore((s) => s.stopRest);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((x) => x + 1), 250);
    return () => clearInterval(i);
  }, []);

  if (!restTimer) return null;

  const elapsed = Math.floor((Date.now() - restTimer.startedAt) / 1000);
  const remaining = Math.max(0, restTimer.durationSec - elapsed);
  const pct = Math.min(100, (elapsed / restTimer.durationSec) * 100);

  return (
    <Card className="bg-accent/10 border-accent/30 slide-up">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-accent" />
          <span className="text-sm font-semibold">Rest</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl font-bold text-accent">
            {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}
          </div>
          <Button size="sm" variant="ghost" onClick={stopRest}>
            <X size={14} />
          </Button>
        </div>
      </div>
      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

function ExerciseBlock({ workoutExId }: { workoutExId: string }) {
  const w = useStore((s) => s.activeWorkout);
  const exercises = useStore((s) => s.exercises);
  const workouts = useStore((s) => s.workouts);
  const we = w?.exercises.find((e) => e.id === workoutExId);
  const ex = exercises.find((e) => e.id === we?.exerciseId);

  const addSet = useStore((s) => s.addSet);
  const removeExerciseFromWorkout = useStore((s) => s.removeExerciseFromWorkout);

  // Previous best for this exercise
  const previousBest = useMemo(() => {
    if (!we) return null;
    let best = { weight: 0, reps: 0 };
    for (const past of workouts) {
      for (const pex of past.exercises) {
        if (pex.exerciseId !== we.exerciseId) continue;
        for (const ps of pex.sets) {
          if (ps.completed && ps.weight * ps.reps > best.weight * best.reps) {
            best = { weight: ps.weight, reps: ps.reps };
          }
        }
      }
    }
    return best.weight > 0 ? best : null;
  }, [we?.exerciseId, workouts]);

  if (!we || !ex) return null;

  return (
    <Card className="space-y-2 slide-up">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display font-bold text-lg leading-tight">{ex.name}</div>
          <div className="text-xs text-muted capitalize">
            {ex.category} · {ex.primary}
            {previousBest && (
              <span className="text-accent ml-2 font-mono">
                PB: {previousBest.weight}kg × {previousBest.reps}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => removeExerciseFromWorkout(we.id)}
          className="text-muted hover:text-danger p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Sets header */}
      <div className="grid grid-cols-[28px_1fr_1fr_60px_40px] gap-2 text-[10px] uppercase tracking-wider text-muted px-1 pt-1">
        <div className="text-center">Set</div>
        <div>Weight</div>
        <div>Reps</div>
        <div className="text-center">RPE</div>
        <div></div>
      </div>

      {/* Sets */}
      {we.sets.map((set, idx) => (
        <SetRow key={set.id} workoutExId={we.id} setId={set.id} idx={idx} />
      ))}

      {/* Add set buttons */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => addSet(we.id, "normal")}
        >
          <Plus size={12} /> Set
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addSet(we.id, "warmup")}
          className="text-blue-400"
        >
          + Warmup
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addSet(we.id, "drop")}
          className="text-orange-400"
        >
          + Drop
        </Button>
      </div>
    </Card>
  );
}

function SetRow({ workoutExId, setId, idx }: { workoutExId: string; setId: string; idx: number }) {
  const w = useStore((s) => s.activeWorkout);
  const updateSet = useStore((s) => s.updateSet);
  const removeSet = useStore((s) => s.removeSet);
  const toggleSetComplete = useStore((s) => s.toggleSetComplete);
  const we = w?.exercises.find((e) => e.id === workoutExId);
  const set = we?.sets.find((s) => s.id === setId);
  if (!set) return null;

  const typeStyles: Record<SetType, { label: string; cls: string }> = {
    normal: { label: String(idx + 1), cls: "bg-elevated text-text" },
    warmup: { label: "W", cls: "bg-blue-400/20 text-blue-400" },
    drop: { label: "D", cls: "bg-orange-400/20 text-orange-400" },
    superset: { label: "S", cls: "bg-purple-400/20 text-purple-400" },
    failure: { label: "F", cls: "bg-danger/20 text-danger" },
  };
  const ts = typeStyles[set.type];

  return (
    <div
      className={`grid grid-cols-[28px_1fr_1fr_60px_40px] gap-2 items-center transition-opacity ${
        set.completed ? "opacity-60" : ""
      }`}
    >
      <div className={`h-8 w-8 rounded flex items-center justify-center font-mono font-bold text-xs ${ts.cls}`}>
        {ts.label}
      </div>
      <Input
        type="number"
        inputMode="decimal"
        value={set.weight || ""}
        placeholder="0"
        className="h-9 text-sm"
        onChange={(e) => updateSet(workoutExId, setId, { weight: parseFloat(e.target.value) || 0 })}
      />
      <Input
        type="number"
        inputMode="numeric"
        value={set.reps || ""}
        placeholder="0"
        className="h-9 text-sm"
        onChange={(e) => updateSet(workoutExId, setId, { reps: parseInt(e.target.value) || 0 })}
      />
      <Input
        type="number"
        inputMode="decimal"
        step="0.5"
        min="1"
        max="10"
        value={set.rpe || ""}
        placeholder="—"
        className="h-9 text-sm text-center"
        onChange={(e) => updateSet(workoutExId, setId, { rpe: parseFloat(e.target.value) || undefined })}
      />
      <button
        onClick={() => toggleSetComplete(workoutExId, setId)}
        className={`h-9 w-9 rounded flex items-center justify-center transition-all ${
          set.completed
            ? "bg-accent text-bg"
            : "bg-elevated border border-border hover:border-accent"
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </button>
    </div>
  );
}

function ExercisePicker({
  onPick,
  onClose,
}: {
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const exercises = useStore((s) => s.exercises);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = exercises.filter((e) => {
    if (filter !== "all" && e.primary !== filter) return false;
    if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const groups = ["all", "chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "core", "cardio"];

  return (
    <Card className="space-y-3 slide-up">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exercises..."
          className="flex-1 bg-transparent outline-none text-base"
        />
        <button onClick={onClose} className="text-muted p-1">
          <X size={18} />
        </button>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`px-3 py-1 rounded text-xs uppercase tracking-wider font-semibold whitespace-nowrap ${
              filter === g ? "bg-accent text-bg" : "bg-elevated text-muted"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="max-h-[50vh] overflow-y-auto space-y-1">
        {filtered.map((e) => (
          <button
            key={e.id}
            onClick={() => onPick(e.id)}
            className="w-full text-left p-3 rounded hover:bg-elevated transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-sm">{e.name}</div>
              <div className="text-xs text-muted capitalize">{e.category} · {e.primary}</div>
            </div>
            <Plus size={16} className="text-accent" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted text-sm">No matches.</div>
        )}
      </div>
    </Card>
  );
}
