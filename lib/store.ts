"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Exercise, Workout, WorkoutExercise, WorkoutSet, Template,
  Food, FoodEntry, MacroTargets, BodyMeasurement, SetType,
} from "./types";
import { SEED_EXERCISES } from "./exercises";
import { SEED_FOODS } from "./foods";
import { uid, startOfDay } from "./utils";

interface State {
  // Library
  exercises: Exercise[];
  foods: Food[];

  // Templates
  templates: Template[];

  // History
  workouts: Workout[];

  // Active session
  activeWorkout: Workout | null;
  restTimer: { startedAt: number; durationSec: number } | null;

  // Macros
  foodEntries: FoodEntry[];
  macroTargets: MacroTargets;
  measurements: BodyMeasurement[];

  // === ACTIONS ===

  // Exercises
  addExercise: (e: Omit<Exercise, "id">) => string;
  deleteExercise: (id: string) => void;

  // Foods
  addFood: (f: Omit<Food, "id">) => string;
  deleteFood: (id: string) => void;

  // Templates
  saveTemplate: (t: Omit<Template, "id" | "createdAt">) => string;
  deleteTemplate: (id: string) => void;

  // Active workout
  startWorkout: (name?: string, fromTemplate?: string) => void;
  endWorkout: () => void;
  cancelWorkout: () => void;
  addExerciseToWorkout: (exerciseId: string) => void;
  removeExerciseFromWorkout: (workoutExId: string) => void;
  addSet: (workoutExId: string, type?: SetType, groupId?: string) => void;
  updateSet: (workoutExId: string, setId: string, patch: Partial<WorkoutSet>) => void;
  removeSet: (workoutExId: string, setId: string) => void;
  toggleSetComplete: (workoutExId: string, setId: string) => void;
  reorderExercises: (fromIdx: number, toIdx: number) => void;
  makeSuperset: (workoutExIdA: string, workoutExIdB: string) => void;

  // Rest timer
  startRest: (sec: number) => void;
  stopRest: () => void;

  // Macros
  logFood: (entry: Omit<FoodEntry, "id" | "loggedAt"> & { loggedAt?: number }) => void;
  removeFoodEntry: (id: string) => void;
  setMacroTargets: (t: MacroTargets) => void;
  addMeasurement: (m: Omit<BodyMeasurement, "id">) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      exercises: SEED_EXERCISES,
      foods: SEED_FOODS,
      templates: [],
      workouts: [],
      activeWorkout: null,
      restTimer: null,
      foodEntries: [],
      macroTargets: { kcal: 2400, protein: 180, carbs: 250, fat: 70 },
      measurements: [],

      addExercise: (e) => {
        const id = uid();
        set((s) => ({ exercises: [...s.exercises, { ...e, id, custom: true }] }));
        return id;
      },
      deleteExercise: (id) =>
        set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) })),

      addFood: (f) => {
        const id = uid();
        set((s) => ({ foods: [...s.foods, { ...f, id, custom: true }] }));
        return id;
      },
      deleteFood: (id) =>
        set((s) => ({ foods: s.foods.filter((f) => f.id !== id) })),

      saveTemplate: (t) => {
        const id = uid();
        set((s) => ({ templates: [...s.templates, { ...t, id, createdAt: Date.now() }] }));
        return id;
      },
      deleteTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      startWorkout: (name, fromTemplate) => {
        const tpl = fromTemplate ? get().templates.find((t) => t.id === fromTemplate) : null;
        const exercises: WorkoutExercise[] = tpl
          ? tpl.exercises.map((te) => ({
              id: uid(),
              exerciseId: te.exerciseId,
              sets: Array.from({ length: te.targetSets }, () => ({
                id: uid(),
                reps: 0,
                weight: 0,
                type: "normal" as SetType,
                completed: false,
              })),
            }))
          : [];
        set({
          activeWorkout: {
            id: uid(),
            name: name || tpl?.name || "Workout",
            startedAt: Date.now(),
            exercises,
          },
        });
      },

      endWorkout: () => {
        const w = get().activeWorkout;
        if (!w) return;
        const finished: Workout = { ...w, endedAt: Date.now() };
        set((s) => ({
          workouts: [finished, ...s.workouts],
          activeWorkout: null,
          restTimer: null,
        }));
      },

      cancelWorkout: () => set({ activeWorkout: null, restTimer: null }),

      addExerciseToWorkout: (exerciseId) => {
        const w = get().activeWorkout;
        if (!w) return;
        set({
          activeWorkout: {
            ...w,
            exercises: [
              ...w.exercises,
              {
                id: uid(),
                exerciseId,
                sets: [
                  { id: uid(), reps: 0, weight: 0, type: "normal", completed: false },
                ],
              },
            ],
          },
        });
      },

      removeExerciseFromWorkout: (workoutExId) => {
        const w = get().activeWorkout;
        if (!w) return;
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.filter((e) => e.id !== workoutExId),
          },
        });
      },

      addSet: (workoutExId, type = "normal", groupId) => {
        const w = get().activeWorkout;
        if (!w) return;
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === workoutExId
                ? {
                    ...e,
                    sets: [
                      ...e.sets,
                      {
                        id: uid(),
                        reps: e.sets[e.sets.length - 1]?.reps ?? 0,
                        weight: e.sets[e.sets.length - 1]?.weight ?? 0,
                        type,
                        groupId,
                        completed: false,
                      },
                    ],
                  }
                : e
            ),
          },
        });
      },

      updateSet: (workoutExId, setId, patch) => {
        const w = get().activeWorkout;
        if (!w) return;
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === workoutExId
                ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
                : e
            ),
          },
        });
      },

      removeSet: (workoutExId, setId) => {
        const w = get().activeWorkout;
        if (!w) return;
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === workoutExId
                ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
                : e
            ),
          },
        });
      },

      toggleSetComplete: (workoutExId, setId) => {
        const w = get().activeWorkout;
        if (!w) return;
        const ex = w.exercises.find((e) => e.id === workoutExId);
        const target = ex?.sets.find((s) => s.id === setId);
        const willComplete = !target?.completed;
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === workoutExId
                ? {
                    ...e,
                    sets: e.sets.map((s) =>
                      s.id === setId ? { ...s, completed: willComplete } : s
                    ),
                  }
                : e
            ),
          },
        });
        // Auto-start rest timer when completing a set
        if (willComplete) {
          const restSec = ex?.restSeconds ?? 90;
          get().startRest(restSec);
        }
      },

      reorderExercises: (fromIdx, toIdx) => {
        const w = get().activeWorkout;
        if (!w) return;
        const arr = [...w.exercises];
        const [moved] = arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, moved);
        set({ activeWorkout: { ...w, exercises: arr } });
      },

      makeSuperset: (a, b) => {
        const w = get().activeWorkout;
        if (!w) return;
        const gid = uid();
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === a || e.id === b
                ? { ...e, sets: e.sets.map((s) => ({ ...s, groupId: gid })) }
                : e
            ),
          },
        });
      },

      startRest: (sec) => set({ restTimer: { startedAt: Date.now(), durationSec: sec } }),
      stopRest: () => set({ restTimer: null }),

      logFood: (entry) => {
        set((s) => ({
          foodEntries: [
            ...s.foodEntries,
            { ...entry, id: uid(), loggedAt: entry.loggedAt ?? Date.now() },
          ],
        }));
      },
      removeFoodEntry: (id) =>
        set((s) => ({ foodEntries: s.foodEntries.filter((e) => e.id !== id) })),

      setMacroTargets: (t) => set({ macroTargets: t }),

      addMeasurement: (m) =>
        set((s) => ({ measurements: [...s.measurements, { ...m, id: uid() }] })),
    }),
    {
      name: "iron-store-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// === Selectors ===

export function selectTodayEntries(state: State): FoodEntry[] {
  const today = startOfDay(Date.now());
  return state.foodEntries.filter((e) => startOfDay(e.loggedAt) === today);
}

export function computeMacrosForEntries(entries: FoodEntry[], foods: Food[]) {
  return entries.reduce(
    (acc, e) => {
      const f = foods.find((fd) => fd.id === e.foodId);
      if (!f) return acc;
      const factor = f.unit === "100g" ? e.amount / 100 : e.amount;
      acc.kcal += f.kcal * factor;
      acc.protein += f.protein * factor;
      acc.carbs += f.carbs * factor;
      acc.fat += f.fat * factor;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
