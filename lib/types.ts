export type ID = string;

export type MuscleGroup =
  | "chest" | "back" | "shoulders" | "biceps" | "triceps"
  | "quads" | "hamstrings" | "glutes" | "calves" | "core" | "cardio" | "other";

export type ExerciseCategory = "barbell" | "dumbbell" | "machine" | "cable" | "bodyweight" | "cardio";

export interface Exercise {
  id: ID;
  name: string;
  category: ExerciseCategory;
  primary: MuscleGroup;
  secondary?: MuscleGroup[];
  custom?: boolean;
}

export type SetType = "normal" | "warmup" | "drop" | "superset" | "failure";

export interface WorkoutSet {
  id: ID;
  reps: number;
  weight: number; // kg
  rpe?: number;
  type: SetType;
  completed: boolean;
  // For supersets, sets share a groupId
  groupId?: ID;
}

export interface WorkoutExercise {
  id: ID;
  exerciseId: ID;
  sets: WorkoutSet[];
  notes?: string;
  restSeconds?: number;
}

export interface Workout {
  id: ID;
  name: string;
  startedAt: number;
  endedAt?: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Template {
  id: ID;
  name: string;
  exercises: { exerciseId: ID; targetSets: number; targetReps?: string }[];
  createdAt: number;
}

// === MACROS ===

export interface Food {
  id: ID;
  name: string;
  // Per 100g (or per serving if unit is "serving")
  unit: "100g" | "serving";
  servingLabel?: string; // e.g. "1 scoop", "1 slice"
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  custom?: boolean;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodEntry {
  id: ID;
  foodId: ID;
  amount: number; // in grams if unit=100g, or # servings if unit=serving
  meal: MealType;
  loggedAt: number;
}

export interface MacroTargets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BodyMeasurement {
  id: ID;
  date: number;
  weight?: number; // kg
  bodyFat?: number;
}
