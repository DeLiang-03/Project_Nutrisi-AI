import { DailyAKGTarget, Gender } from '../types/nutrition';

// Calculate age in months and display text from birthDate
export function calculateAge(birthDateStr: string): { months: number; years: number; remainingMonths: number; display: string } {
  const birth = new Date(birthDateStr);
  const now = new Date();

  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  months = Math.max(0, months);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let display = '';
  if (years === 0) {
    display = `${months} bulan`;
  } else if (remainingMonths === 0) {
    display = `${years} tahun`;
  } else {
    display = `${years} tahun ${remainingMonths} bulan`;
  }

  return { months, years, remainingMonths, display };
}

// Recommended Dietary Allowance based on Permenkes RI No. 28 / 2019
export function getDailyAKGTarget(ageMonths: number): DailyAKGTarget {
  if (ageMonths < 6) {
    return {
      calories: 550,
      protein: 9,
      animalProteinTarget: 9,
      carbs: 59,
      fat: 31,
      fiber: 0,
      calciumMg: 200,
      ironMg: 0.3,
      zincMg: 1.1,
      vitaminAMcg: 375,
    };
  } else if (ageMonths < 12) {
    return {
      calories: 800,
      protein: 15,
      animalProteinTarget: 10,
      carbs: 105,
      fat: 35,
      fiber: 11,
      calciumMg: 270,
      ironMg: 11,
      zincMg: 3,
      vitaminAMcg: 400,
    };
  } else if (ageMonths < 36) { // 1-3 years
    return {
      calories: 1350,
      protein: 20,
      animalProteinTarget: 12,
      carbs: 215,
      fat: 45,
      fiber: 19,
      calciumMg: 650,
      ironMg: 7,
      zincMg: 3,
      vitaminAMcg: 400,
    };
  } else { // 4-6 years
    return {
      calories: 1400,
      protein: 25,
      animalProteinTarget: 15,
      carbs: 220,
      fat: 50,
      fiber: 20,
      calciumMg: 1000,
      ironMg: 10,
      zincMg: 5,
      vitaminAMcg: 450,
    };
  }
}

// WHO Child Growth Standards Median and SD for Length/Height for Age (TB/U)
// Stunting is evaluated using TB/U (Z-Score < -2 SD)
export interface StuntingAssessment {
  status: 'Sangat Pendek (Severely Stunted)' | 'Pendek (Stunted)' | 'Normal' | 'Tinggi';
  color: string;
  badgeBg: string;
  zScore: number;
  medianHeightCm: number;
  sdCm: number;
  recommendation: string;
}

export function assessStunting(ageMonths: number, heightCm: number, gender: Gender): StuntingAssessment {
  // Approximate WHO length/height medians and SD (0-60 months)
  // Formula calibrated to WHO 2006 tables
  const isMale = gender === 'male';
  let median = isMale ? 50.0 : 49.5;
  let sd = isMale ? 1.9 : 1.8;

  if (ageMonths <= 12) {
    median += ageMonths * (isMale ? 2.1 : 2.0);
    sd = 2.4;
  } else if (ageMonths <= 24) {
    median = (isMale ? 75.7 : 74.0) + (ageMonths - 12) * (isMale ? 1.0 : 1.0);
    sd = 3.0;
  } else if (ageMonths <= 36) {
    median = (isMale ? 87.8 : 86.5) + (ageMonths - 24) * (isMale ? 0.75 : 0.75);
    sd = 3.5;
  } else if (ageMonths <= 48) {
    median = (isMale ? 96.1 : 95.1) + (ageMonths - 36) * (isMale ? 0.65 : 0.65);
    sd = 3.9;
  } else {
    median = (isMale ? 103.3 : 102.7) + (ageMonths - 48) * (isMale ? 0.58 : 0.58);
    sd = 4.2;
  }

  const zScore = parseFloat(((heightCm - median) / sd).toFixed(2));

  if (zScore < -3) {
    return {
      status: 'Sangat Pendek (Severely Stunted)',
      color: 'text-red-700',
      badgeBg: 'bg-red-100 text-red-800 border-red-300',
      zScore,
      medianHeightCm: Math.round(median * 10) / 10,
      sdCm: sd,
      recommendation: 'Perlu konsultasi segera dengan Dokter Spesialis Anak / Puskesmas. Prioritaskan asupan protein hewani tinggi (telur, hati, ikan) setiap kali makan.',
    };
  } else if (zScore < -2) {
    return {
      status: 'Pendek (Stunted)',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      zScore,
      medianHeightCm: Math.round(median * 10) / 10,
      sdCm: sd,
      recommendation: 'Perlu perhatian khusus gizi. Tingkatkan 1 butir telur/hari, daging/ikan, serta makanan kaya zinc dan kalsium untuk percepatan tinggi badan (catch-up growth).',
    };
  } else if (zScore <= 2) {
    return {
      status: 'Normal',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      zScore,
      medianHeightCm: Math.round(median * 10) / 10,
      sdCm: sd,
      recommendation: 'Pertumbuhan tinggi badan optimal! Pertahankan menu gizi seimbang dengan variasi lauk pauk protein hewani dan sayur buah.',
    };
  } else {
    return {
      status: 'Tinggi',
      color: 'text-blue-700',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      zScore,
      medianHeightCm: Math.round(median * 10) / 10,
      sdCm: sd,
      recommendation: 'Tinggi badan di atas rata-rata usia sebaya. Pertahankan pola makan bergizi seimbang dan aktivitas fisik aktif.',
    };
  }
}

// Weight for Age (BB/U)
export interface WeightAssessment {
  status: 'Gizi Buruk' | 'Gizi Kurang' | 'Normal' | 'Risiko BB Lebih';
  color: string;
  badgeBg: string;
  zScore: number;
  medianWeightKg: number;
}

export function assessWeight(ageMonths: number, weightKg: number, gender: Gender): WeightAssessment {
  const isMale = gender === 'male';
  let median = isMale ? 3.3 : 3.2;
  let sd = isMale ? 0.45 : 0.43;

  if (ageMonths <= 12) {
    median = (isMale ? 3.3 : 3.2) + ageMonths * (isMale ? 0.55 : 0.52);
    sd = 1.0;
  } else if (ageMonths <= 24) {
    median = (isMale ? 9.6 : 8.9) + (ageMonths - 12) * (isMale ? 0.22 : 0.22);
    sd = 1.3;
  } else if (ageMonths <= 36) {
    median = (isMale ? 12.2 : 11.5) + (ageMonths - 24) * (isMale ? 0.18 : 0.18);
    sd = 1.5;
  } else if (ageMonths <= 48) {
    median = (isMale ? 14.3 : 13.9) + (ageMonths - 36) * (isMale ? 0.17 : 0.17);
    sd = 1.8;
  } else {
    median = (isMale ? 16.3 : 16.1) + (ageMonths - 48) * (isMale ? 0.17 : 0.17);
    sd = 2.1;
  }

  const zScore = parseFloat(((weightKg - median) / sd).toFixed(2));

  if (zScore < -3) {
    return {
      status: 'Gizi Buruk',
      color: 'text-red-700',
      badgeBg: 'bg-red-100 text-red-800 border-red-300',
      zScore,
      medianWeightKg: Math.round(median * 10) / 10,
    };
  } else if (zScore < -2) {
    return {
      status: 'Gizi Kurang',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      zScore,
      medianWeightKg: Math.round(median * 10) / 10,
    };
  } else if (zScore <= 1) {
    return {
      status: 'Normal',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      zScore,
      medianWeightKg: Math.round(median * 10) / 10,
    };
  } else {
    return {
      status: 'Risiko BB Lebih',
      color: 'text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      zScore,
      medianWeightKg: Math.round(median * 10) / 10,
    };
  }
}
