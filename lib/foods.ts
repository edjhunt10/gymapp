import type { Food } from "./types";

// Macros per 100g unless unit = "serving"
export const SEED_FOODS: Food[] = [
  // Protein
  { id: "f_chicken", name: "Chicken Breast (raw)", unit: "100g", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f_beef_lean", name: "Lean Beef Mince 5%", unit: "100g", kcal: 137, protein: 21.4, carbs: 0, fat: 5 },
  { id: "f_salmon", name: "Salmon Fillet", unit: "100g", kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "f_tuna", name: "Tuna (canned in water)", unit: "100g", kcal: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "f_eggs", name: "Whole Egg", unit: "serving", servingLabel: "1 large egg", kcal: 72, protein: 6.3, carbs: 0.4, fat: 5 },
  { id: "f_egg_white", name: "Egg White", unit: "serving", servingLabel: "1 large white", kcal: 17, protein: 3.6, carbs: 0.2, fat: 0.1 },
  { id: "f_greek_yog", name: "Greek Yogurt 0%", unit: "100g", kcal: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { id: "f_cottage", name: "Cottage Cheese", unit: "100g", kcal: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { id: "f_whey", name: "Whey Protein", unit: "serving", servingLabel: "1 scoop (30g)", kcal: 120, protein: 24, carbs: 3, fat: 1.5 },

  // Carbs
  { id: "f_rice_white", name: "White Rice (cooked)", unit: "100g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: "f_rice_brown", name: "Brown Rice (cooked)", unit: "100g", kcal: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { id: "f_oats", name: "Rolled Oats (dry)", unit: "100g", kcal: 379, protein: 13, carbs: 68, fat: 6.5 },
  { id: "f_pasta", name: "Pasta (cooked)", unit: "100g", kcal: 131, protein: 5, carbs: 25, fat: 1.1 },
  { id: "f_potato", name: "Potato (boiled)", unit: "100g", kcal: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { id: "f_sweet_pot", name: "Sweet Potato", unit: "100g", kcal: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { id: "f_bread_white", name: "White Bread", unit: "serving", servingLabel: "1 slice (35g)", kcal: 90, protein: 3, carbs: 17, fat: 1 },
  { id: "f_bread_brown", name: "Wholemeal Bread", unit: "serving", servingLabel: "1 slice (40g)", kcal: 95, protein: 4.5, carbs: 16, fat: 1.5 },
  { id: "f_banana", name: "Banana", unit: "serving", servingLabel: "1 medium", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: "f_apple", name: "Apple", unit: "serving", servingLabel: "1 medium", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3 },

  // Fats
  { id: "f_avocado", name: "Avocado", unit: "100g", kcal: 160, protein: 2, carbs: 9, fat: 15 },
  { id: "f_olive_oil", name: "Olive Oil", unit: "serving", servingLabel: "1 tbsp (14g)", kcal: 119, protein: 0, carbs: 0, fat: 13.5 },
  { id: "f_almonds", name: "Almonds", unit: "100g", kcal: 579, protein: 21, carbs: 22, fat: 50 },
  { id: "f_peanut_butter", name: "Peanut Butter", unit: "serving", servingLabel: "1 tbsp (16g)", kcal: 94, protein: 4, carbs: 3.5, fat: 8 },

  // Veg
  { id: "f_broccoli", name: "Broccoli", unit: "100g", kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: "f_spinach", name: "Spinach", unit: "100g", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },

  // Dairy
  { id: "f_milk_skim", name: "Skim Milk", unit: "100g", kcal: 34, protein: 3.4, carbs: 5, fat: 0.1 },
  { id: "f_cheddar", name: "Cheddar Cheese", unit: "100g", kcal: 402, protein: 25, carbs: 1.3, fat: 33 },
];
