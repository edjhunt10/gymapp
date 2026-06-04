"use client";

import { useStore } from "@/lib/store";
import { Button, Card, Input, Label, PageTitle, Modal } from "@/components/ui/primitives";
import { Plus, Search, X, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ExerciseCategory, MuscleGroup } from "@/lib/types";

const MUSCLES: MuscleGroup[] = ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves", "core", "cardio", "other"];
const CATEGORIES: ExerciseCategory[] = ["barbell", "dumbbell", "machine", "cable", "bodyweight", "cardio"];

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const exercises = useStore((s) => s.exercises);
  const addExercise = useStore((s) => s.addExercise);
  const deleteExercise = useStore((s) => s.deleteExercise);
  const templates = useStore((s) => s.templates);
  const deleteTemplate = useStore((s) => s.deleteTemplate);
  const startWorkout = useStore((s) => s.startWorkout);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"exercises" | "templates">("exercises");

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (filter !== "all" && e.primary !== filter) return false;
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [exercises, q, filter]);

  if (!mounted) return null;

  return (
    <div>
      <PageTitle sub={`${exercises.length} exercises · ${templates.length} templates`}>Library</PageTitle>

      <div className="flex gap-1 mb-4 bg-elevated p-1 rounded">
        <button
          onClick={() => setTab("exercises")}
          className={`flex-1 py-2 rounded text-sm font-semibold ${tab === "exercises" ? "bg-bg text-text" : "text-muted"}`}
        >
          Exercises
        </button>
        <button
          onClick={() => setTab("templates")}
          className={`flex-1 py-2 rounded text-sm font-semibold ${tab === "templates" ? "bg-bg text-text" : "text-muted"}`}
        >
          Templates
        </button>
      </div>

      {tab === "exercises" && (
        <>
          <div className="flex items-center gap-2 bg-elevated border border-border rounded px-3 mb-3">
            <Search size={16} className="text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none py-3 text-base"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 mb-3">
            {["all", ...MUSCLES].map((m) => (
              <button
                key={m}
                onClick={() => setFilter(m)}
                className={`px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold whitespace-nowrap ${
                  filter === m ? "bg-accent text-bg" : "bg-elevated text-muted"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <Button className="w-full mb-3" onClick={() => setShow(true)}>
            <Plus size={16} /> Add Custom Exercise
          </Button>

          <div className="space-y-1">
            {filtered.map((e) => (
              <Card key={e.id} className="py-3 flex items-center justify-between group">
                <div>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-muted capitalize">
                    {e.category} · {e.primary}
                    {e.secondary && e.secondary.length > 0 && ` + ${e.secondary.join(", ")}`}
                    {e.custom && <span className="text-accent ml-2">custom</span>}
                  </div>
                </div>
                {e.custom && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${e.name}"?`)) deleteExercise(e.id);
                    }}
                    className="text-muted hover:text-danger p-1 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "templates" && (
        <div className="space-y-2">
          {templates.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-muted text-sm">
                No templates yet. Save one during a workout to reuse it.
              </p>
            </Card>
          )}
          {templates.map((t) => (
            <Card key={t.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-display font-bold">{t.name}</div>
                  <div className="text-xs text-muted">
                    {t.exercises.length} exercises ·{" "}
                    {new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => {
                      startWorkout(undefined, t.id);
                      window.location.href = "/workouts/active";
                    }}
                  >
                    Start
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${t.name}"?`)) deleteTemplate(t.id);
                    }}
                    className="text-muted hover:text-danger p-2 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-muted">
                {t.exercises.slice(0, 3).map((te) => {
                  const ex = exercises.find((e) => e.id === te.exerciseId);
                  return ex?.name;
                }).filter(Boolean).join(", ")}
                {t.exercises.length > 3 && ` +${t.exercises.length - 3}`}
              </div>
            </Card>
          ))}
        </div>
      )}

      {show && <NewExerciseModal onClose={() => setShow(false)} onSave={(e) => { addExercise(e); setShow(false); }} />}
    </div>
  );
}

function NewExerciseModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (e: { name: string; category: ExerciseCategory; primary: MuscleGroup }) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("barbell");
  const [primary, setPrimary] = useState<MuscleGroup>("chest");

  return (
    <Modal onClose={onClose} title="New Exercise">
      <div className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <Label>Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
            className="w-full h-11 bg-elevated border border-border rounded px-3 outline-none focus:border-accent capitalize mt-1"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label>Primary muscle</Label>
          <select
            value={primary}
            onChange={(e) => setPrimary(e.target.value as MuscleGroup)}
            className="w-full h-11 bg-elevated border border-border rounded px-3 outline-none focus:border-accent capitalize mt-1"
          >
            {MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-5">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (!name.trim()) return;
            onSave({ name: name.trim(), category, primary });
          }}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
