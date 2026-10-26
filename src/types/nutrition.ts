export type Gender = 'male' | 'female';

export type MealType = 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan_pagi' | 'camilan_sore';

export interface ChildProfile {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
  avatar: string;
  allergies: string[];
  isGtm: boolean; // Sedang GTM (Gerakan Tutup Mulut)
  notes: string;
}

export interface NutritionalFacts {
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface Micronutrient {
  nutrient: string;
  amount: string;
  benefit_category: string;
}

export interface FoodAnalysisData {
  is_food: boolean;
  food_name: string;
  estimated_portion: string;
  nutritional_facts: NutritionalFacts;
  key_micronutrients: Micronutrient[];
  stunting_prevention_score: 'Tinggi' | 'Sedang' | 'Cukup' | string;
  child_growth_summary: string;
}

export interface MealEntry {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: MealType;
  image?: string;
  foodName: string;
  estimatedPortion: string;
  interactiveMessage: string;
  nutritionalFacts: NutritionalFacts;
  keyMicronutrients: Micronutrient[];
  stuntingPreventionScore: string;
  childGrowthSummary: string;
  hasAnimalProtein: boolean;
  createdAt: string;
}

export interface DailyAKGTarget {
  calories: number;
  protein: number; // total gram
  animalProteinTarget: number; // gram
  carbs: number;
  fat: number;
  fiber: number;
  calciumMg: number;
  ironMg: number;
  zincMg: number;
  vitaminAMcg: number;
}

export interface GrowthRecord {
  id: string;
  childId: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  notes?: string;
}
