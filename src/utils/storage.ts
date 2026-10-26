import { ChildProfile, GrowthRecord, MealEntry } from '../types/nutrition';

const CHILDREN_KEY = 'nutribot_children';
const ACTIVE_CHILD_KEY = 'nutribot_active_child_id';
const MEALS_KEY = 'nutribot_meals';
const GROWTH_KEY = 'nutribot_growth_records';

const TODAY = new Date().toISOString().split('T')[0];

export const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1',
    name: 'Al Fatih Pratama',
    gender: 'male',
    birthDate: '2024-08-15', // ~26 months
    weightKg: 12.4,
    heightCm: 87.5,
    headCircumferenceCm: 48.0,
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80',
    allergies: [],
    isGtm: false,
    notes: 'Sedang suka makan sendiri pakai sendok garpu, sangat aktif berlari.',
  },
  {
    id: 'child-2',
    name: 'Aisha Zahra',
    gender: 'female',
    birthDate: '2025-08-10', // ~14 months
    weightKg: 8.6,
    heightCm: 73.5,
    headCircumferenceCm: 45.2,
    avatar: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80',
    allergies: ['Alergi seafood udang'],
    isGtm: true,
    notes: 'Fase tumbuh gigi seri atas, sedang agak pilih-pilih makanan (GTM ringan). Membutuhkan booster protein hewani.',
  },
];

export const INITIAL_MEALS: MealEntry[] = [
  {
    id: 'meal-init-1',
    childId: 'child-1',
    date: TODAY,
    time: '07:30',
    mealType: 'sarapan',
    foodName: 'Bubur Tim Hati Ayam & Telur Puyuh',
    estimatedPortion: '1 mangkuk porsi anak (~150 gram)',
    interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Bubur Tim Hati Ayam & Telur Puyuh!
LUAR BIASA! Sarapan super kaya protein hewani ganda (Hati Ayam + Telur Puyuh).

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- 🦴 **Otot Kuat & Cepat Tinggi (Protein Hewani):** Memacu pertambahan tinggi badan linier.
- 🧠 **Otak Cerdas (Zat Besi Heme):** Menghindarkan lemas dan meningkatkan konsentrasi.
- 🛡️ **Perisai Tubuh (Vitamin A & Zinc):** Imunitas kuat menangkal flu.

💡 **Tips Seru NutriDe:**
Sajikan hangat dengan taburan bawang goreng harum agar si kecil semakin lahap!`,
    nutritionalFacts: {
      calories_kcal: 235,
      protein_g: 11.5,
      carbohydrates_g: 22.0,
      fat_g: 10.2,
      fiber_g: 1.2,
    },
    keyMicronutrients: [
      { nutrient: 'Zat Besi (Heme)', amount: '4.2 mg', benefit_category: 'darah & otak cerdas' },
      { nutrient: 'Seng (Zinc)', amount: '2.5 mg', benefit_category: 'pertumbuhan tinggi badan' },
      { nutrient: 'Vitamin A', amount: '680 mcg', benefit_category: 'kesehatan mata' },
    ],
    stuntingPreventionScore: 'Sangat Tinggi (Superfood Anti-Stunting)',
    childGrowthSummary: 'Kombinasi asam amino esensial dan zat besi heme yang sangat optimal mencegah stunting.',
    hasAnimalProtein: true,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'meal-init-2',
    childId: 'child-1',
    date: TODAY,
    time: '10:00',
    mealType: 'camilan_pagi',
    foodName: 'Pisang Cavendish Manis',
    estimatedPortion: '1 buah sedang (~120 gram)',
    interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Pisang Cavendish!
Camilan alami kaya kalium untuk mengisi baterai energi bermain si kecil!`,
    nutritionalFacts: {
      calories_kcal: 105,
      protein_g: 1.3,
      carbohydrates_g: 27.0,
      fat_g: 0.3,
      fiber_g: 3.1,
    },
    keyMicronutrients: [
      { nutrient: 'Kalium', amount: '422 mg', benefit_category: 'fungsi otot & elektrolit' },
      { nutrient: 'Vitamin B6', amount: '0.4 mg', benefit_category: 'perkembangan saraf' },
    ],
    stuntingPreventionScore: 'Sedang (Bagus untuk energi)',
    childGrowthSummary: 'Camilan sehat penghasil energi tanpa gula buatan.',
    hasAnimalProtein: false,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_GROWTH_RECORDS: GrowthRecord[] = [
  {
    id: 'rec-1',
    childId: 'child-1',
    date: '2026-06-15',
    ageMonths: 22,
    weightKg: 11.6,
    heightCm: 84.8,
  },
  {
    id: 'rec-2',
    childId: 'child-1',
    date: '2026-08-15',
    ageMonths: 24,
    weightKg: 12.0,
    heightCm: 86.2,
  },
  {
    id: 'rec-3',
    childId: 'child-1',
    date: '2026-10-15',
    ageMonths: 26,
    weightKg: 12.4,
    heightCm: 87.5,
  },
];

export function getStoredChildren(): ChildProfile[] {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    if (!raw) {
      localStorage.setItem(CHILDREN_KEY, JSON.stringify(INITIAL_CHILDREN));
      return INITIAL_CHILDREN;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHILDREN;
  }
}

export function saveChildren(children: ChildProfile[]): void {
  localStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
}

export function getActiveChildId(): string {
  const stored = localStorage.getItem(ACTIVE_CHILD_KEY);
  if (stored) return stored;
  const children = getStoredChildren();
  const defaultId = children[0]?.id || 'child-1';
  localStorage.setItem(ACTIVE_CHILD_KEY, defaultId);
  return defaultId;
}

export function setActiveChildId(id: string): void {
  localStorage.setItem(ACTIVE_CHILD_KEY, id);
}

export function getStoredMeals(): MealEntry[] {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (!raw) {
      localStorage.setItem(MEALS_KEY, JSON.stringify(INITIAL_MEALS));
      return INITIAL_MEALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEALS;
  }
}

export function saveMeal(meal: MealEntry): void {
  const current = getStoredMeals();
  const updated = [meal, ...current];
  localStorage.setItem(MEALS_KEY, JSON.stringify(updated));
}

export function deleteMeal(mealId: string): void {
  const current = getStoredMeals();
  const updated = current.filter((m) => m.id !== mealId);
  localStorage.setItem(MEALS_KEY, JSON.stringify(updated));
}

export function getStoredGrowthRecords(): GrowthRecord[] {
  try {
    const raw = localStorage.getItem(GROWTH_KEY);
    if (!raw) {
      localStorage.setItem(GROWTH_KEY, JSON.stringify(INITIAL_GROWTH_RECORDS));
      return INITIAL_GROWTH_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GROWTH_RECORDS;
  }
}

export function saveGrowthRecord(record: GrowthRecord): void {
  const current = getStoredGrowthRecords();
  const updated = [...current, record].sort((a, b) => a.ageMonths - b.ageMonths);
  localStorage.setItem(GROWTH_KEY, JSON.stringify(updated));
}
