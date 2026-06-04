import type { Exercise } from "./types";

export const SEED_EXERCISES: Exercise[] = [
  // Chest
  { id: "ex_bench", name: "Barbell Bench Press", category: "barbell", primary: "chest", secondary: ["triceps", "shoulders"] },
  { id: "ex_inc_bench", name: "Incline Barbell Bench Press", category: "barbell", primary: "chest", secondary: ["shoulders"] },
  { id: "ex_db_bench", name: "Dumbbell Bench Press", category: "dumbbell", primary: "chest", secondary: ["triceps"] },
  { id: "ex_inc_db", name: "Incline Dumbbell Press", category: "dumbbell", primary: "chest", secondary: ["shoulders"] },
  { id: "ex_dips", name: "Dips", category: "bodyweight", primary: "chest", secondary: ["triceps"] },
  { id: "ex_cable_fly", name: "Cable Fly", category: "cable", primary: "chest" },
  { id: "ex_pushup", name: "Push-up", category: "bodyweight", primary: "chest", secondary: ["triceps"] },

  // Back
  { id: "ex_deadlift", name: "Deadlift", category: "barbell", primary: "back", secondary: ["hamstrings", "glutes"] },
  { id: "ex_pullup", name: "Pull-up", category: "bodyweight", primary: "back", secondary: ["biceps"] },
  { id: "ex_chinup", name: "Chin-up", category: "bodyweight", primary: "back", secondary: ["biceps"] },
  { id: "ex_bb_row", name: "Barbell Row", category: "barbell", primary: "back", secondary: ["biceps"] },
  { id: "ex_db_row", name: "Dumbbell Row", category: "dumbbell", primary: "back" },
  { id: "ex_lat_pull", name: "Lat Pulldown", category: "cable", primary: "back", secondary: ["biceps"] },
  { id: "ex_seated_row", name: "Seated Cable Row", category: "cable", primary: "back" },
  { id: "ex_t_bar", name: "T-Bar Row", category: "machine", primary: "back" },

  // Shoulders
  { id: "ex_ohp", name: "Overhead Press", category: "barbell", primary: "shoulders", secondary: ["triceps"] },
  { id: "ex_db_ohp", name: "Dumbbell Shoulder Press", category: "dumbbell", primary: "shoulders", secondary: ["triceps"] },
  { id: "ex_lat_raise", name: "Lateral Raise", category: "dumbbell", primary: "shoulders" },
  { id: "ex_rear_delt", name: "Rear Delt Fly", category: "dumbbell", primary: "shoulders" },
  { id: "ex_face_pull", name: "Face Pull", category: "cable", primary: "shoulders" },

  // Arms
  { id: "ex_bb_curl", name: "Barbell Curl", category: "barbell", primary: "biceps" },
  { id: "ex_db_curl", name: "Dumbbell Curl", category: "dumbbell", primary: "biceps" },
  { id: "ex_hammer", name: "Hammer Curl", category: "dumbbell", primary: "biceps" },
  { id: "ex_preacher", name: "Preacher Curl", category: "cable", primary: "biceps" },
  { id: "ex_skull", name: "Skull Crusher", category: "barbell", primary: "triceps" },
  { id: "ex_pushdown", name: "Cable Tricep Pushdown", category: "cable", primary: "triceps" },
  { id: "ex_tri_ext", name: "Overhead Tricep Extension", category: "dumbbell", primary: "triceps" },
  { id: "ex_close_bench", name: "Close-Grip Bench Press", category: "barbell", primary: "triceps", secondary: ["chest"] },

  // Legs
  { id: "ex_squat", name: "Back Squat", category: "barbell", primary: "quads", secondary: ["glutes"] },
  { id: "ex_front_squat", name: "Front Squat", category: "barbell", primary: "quads" },
  { id: "ex_leg_press", name: "Leg Press", category: "machine", primary: "quads", secondary: ["glutes"] },
  { id: "ex_lunge", name: "Walking Lunge", category: "dumbbell", primary: "quads", secondary: ["glutes"] },
  { id: "ex_bulgarian", name: "Bulgarian Split Squat", category: "dumbbell", primary: "quads", secondary: ["glutes"] },
  { id: "ex_rdl", name: "Romanian Deadlift", category: "barbell", primary: "hamstrings", secondary: ["glutes"] },
  { id: "ex_leg_curl", name: "Leg Curl", category: "machine", primary: "hamstrings" },
  { id: "ex_leg_ext", name: "Leg Extension", category: "machine", primary: "quads" },
  { id: "ex_hip_thrust", name: "Hip Thrust", category: "barbell", primary: "glutes" },
  { id: "ex_calf_raise", name: "Standing Calf Raise", category: "machine", primary: "calves" },

  // Core
  { id: "ex_plank", name: "Plank", category: "bodyweight", primary: "core" },
  { id: "ex_hanging", name: "Hanging Leg Raise", category: "bodyweight", primary: "core" },
  { id: "ex_cable_crunch", name: "Cable Crunch", category: "cable", primary: "core" },
  { id: "ex_ab_wheel", name: "Ab Wheel Rollout", category: "bodyweight", primary: "core" },

  // Cardio
  { id: "ex_run", name: "Running", category: "cardio", primary: "cardio" },
  { id: "ex_bike", name: "Cycling", category: "cardio", primary: "cardio" },
  { id: "ex_row_erg", name: "Rowing Machine", category: "cardio", primary: "cardio" },
  { id: "ex_stair", name: "Stair Master", category: "cardio", primary: "cardio" },
];
