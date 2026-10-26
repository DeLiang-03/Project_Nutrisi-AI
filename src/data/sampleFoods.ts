export interface SampleFood {
  id: string;
  name: string;
  tag: string;
  badge: string;
  badgeColor: string;
  imageUrl: string;
  description: string;
  estimatedPortion: string;
  mealType: 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan_pagi' | 'camilan_sore';
  isAnimalProteinSuperfood: boolean;
  precomputedAnalysis: {
    interactiveMessage: string;
    dataJson: {
      is_food: boolean;
      food_name: string;
      estimated_portion: string;
      nutritional_facts: {
        calories_kcal: number;
        protein_g: number;
        carbohydrates_g: number;
        fat_g: number;
        fiber_g: number;
      };
      key_micronutrients: Array<{
        nutrient: string;
        amount: string;
        benefit_category: string;
      }>;
      stunting_prevention_score: string;
      child_growth_summary: string;
    };
  };
}

export const SAMPLE_FOODS: SampleFood[] = [
  {
    id: 'pisang-cavendish',
    name: 'Pisang Cavendish Manis',
    tag: 'Camilan Sehat',
    badge: 'Kaya Kalium & Energi',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    description: '1 buah pisang ukuran sedang siap makan, sumber karbohidrat alami dan elektrolit.',
    estimatedPortion: '1 buah sedang (~120 gram)',
    mealType: 'camilan_pagi',
    isAnimalProteinSuperfood: false,
    precomputedAnalysis: {
      interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Pisang Cavendish Manis!
Wah, pilihan camilan alami yang luar biasa untuk hari ini! Manis alami, lembut, dan disukai si kecil.

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- ⚡ **Energi Juara (Karbohidrat Alami):** Memberikan energi instan agar si kecil bisa aktif bermain dan eksplorasi sepanjang hari.
- 🧠 **Konsentrasi Hebat (Kalium & Vitamin B6):** Membantu fungsi saraf dan membuat otak si kecil makin fokus saat belajar hal baru!
- 🛡️ **Perut Happy (Serat Alami):** Menjaga pencernaan tetap lancar dan bebas sembelit.

💡 **Tips Seru NutriDe:**
Coba potong pisang membentuk roda mobil atau celupkan ke sedikit yogurt beku agar si kecil semakin lahap memakannya!`,
      dataJson: {
        is_food: true,
        food_name: 'Pisang Cavendish',
        estimated_portion: '1 buah ukuran sedang (~120 gram)',
        nutritional_facts: {
          calories_kcal: 105,
          protein_g: 1.3,
          carbohydrates_g: 27.0,
          fat_g: 0.3,
          fiber_g: 3.1,
        },
        key_micronutrients: [
          { nutrient: 'Kalium', amount: '422 mg', benefit_category: 'fungsi otot & elektrolit' },
          { nutrient: 'Vitamin B6', amount: '0.4 mg', benefit_category: 'perkembangan otak' },
          { nutrient: 'Vitamin C', amount: '10 mg', benefit_category: 'daya tahan tubuh' },
        ],
        stunting_prevention_score: 'Sedang (Baik untuk energi & mikronutrien harian)',
        child_growth_summary: 'Sumber energi cepat dan kalium yang sangat baik untuk perkembangan motorik anak.',
      },
    },
  },
  {
    id: 'bubur-hati-telur',
    name: 'Bubur Tim Hati Ayam & Telur Puyuh',
    tag: 'Superfood Stunting',
    badge: 'Juara Anti-Stunting ⭐',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    description: 'Kombinasi protein hewani ganda (Hati Ayam + Telur) dengan zat besi dan zinc tinggi.',
    estimatedPortion: '1 mangkuk porsi anak (~150 gram)',
    mealType: 'sarapan',
    isAnimalProteinSuperfood: true,
    precomputedAnalysis: {
      interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Bubur Tim Hati Ayam & Telur Puyuh!
LUAR BIASA BUNDA! Ini adalah MENU JUARA PENCEGAH STUNTING nomor satu! Kombinasi hati ayam dan telur adalah harta karun gizi untuk pertumbuhan linier tulang anak.

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- 🦴 **Otot Kuat & Cepat Tinggi (Protein Hewani Ganda):** Asam amino esensial lengkap yang langsung diserap untuk mempercepat pertambahan tinggi badan!
- 🧠 **Otak Cerdas & Anti Anemia (Zat Besi Heme & Seng/Zinc):** Hati ayam kaya zat besi tipe Heme yang mudah diserap, mencegah anak lemas dan meningkatkan IQ!
- 🛡️ **Mata Tajam Elang (Vitamin A Alami):** Mendukung penglihatan jernih dan imunitas saluran pernapasan.

💡 **Tips Seru NutriDe:**
Bila si kecil sedang fase GTM dengan aroma hati ayam, masak hati ayam dengan sedikit parutan jahe, bawang putih, dan sedikit santan gurih agar aromanya sangat menggugah selera!`,
      dataJson: {
        is_food: true,
        food_name: 'Bubur Tim Hati Ayam & Telur Puyuh',
        estimated_portion: '1 mangkuk anak (~150 gram)',
        nutritional_facts: {
          calories_kcal: 235,
          protein_g: 11.5,
          carbohydrates_g: 22.0,
          fat_g: 10.2,
          fiber_g: 1.2,
        },
        key_micronutrients: [
          { nutrient: 'Zat Besi (Heme)', amount: '4.2 mg', benefit_category: 'pembentukan sel darah & kecerdasan otak' },
          { nutrient: 'Seng (Zinc)', amount: '2.5 mg', benefit_category: 'percepatan tinggi badan & imunitas' },
          { nutrient: 'Vitamin A', amount: '680 mcg', benefit_category: 'kesehatan mata & mukosa' },
          { nutrient: 'Kalsium', amount: '85 mg', benefit_category: 'kepadatan tulang & gigi' },
        ],
        stunting_prevention_score: 'Sangat Tinggi (Pilihan Utama Kemenkes RI)',
        child_growth_summary: 'Kaya asam amino esensial dan zat besi heme yang paling efektif mencegah stunting pada balita.',
      },
    },
  },
  {
    id: 'nasi-ikan-kembung',
    name: 'Nasi Ikan Kembung & Sayur Bening Bayam',
    tag: 'Menu Seimbang',
    badge: 'Kaya Omega-3 & Kalsium',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    description: 'Ikan kembung lokal tinggi omega-3 dan DHA, dipadukan bayam segar kaya zat besi dan jagung manis.',
    estimatedPortion: '1 piring Isi Piringku (~180 gram)',
    mealType: 'makan_siang',
    isAnimalProteinSuperfood: true,
    precomputedAnalysis: {
      interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Nasi + Ikan Kembung Bakar + Sayur Bening Bayam!
Mantap sekali! Tahukah Bunda? Kandungan Omega-3 dan DHA Ikan Kembung lokal bahkan lebih tinggi dari ikan salmon impor!

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- 🧠 **Otak Jenius (Omega-3 DHA & EPA):** Membangun jutaan koneksi sel saraf di otak anak agar daya tangkap dan bicaranya makin cepat!
- 🦴 **Tulang Kokoh (Kalsium & Protein Hewani):** Membantu pembentukan matriks tulang anak yang sedang aktif melompat dan berlari.
- 🛡️ **Perisai Tubuh Hijau (Zat Besi & Folat Bayam):** Memberikan warna merah sehat pada pipi si kecil dan menjaganya dari infeksi.

💡 **Tips Seru NutriDe:**
Pastikan duri halus ikan kembung sudah dibersihkan ya Bun! Suwir daging ikan ke dalam kuah manis bening bayam agar si kecil mudah menelan saat makan siang.`,
      dataJson: {
        is_food: true,
        food_name: 'Nasi Ikan Kembung & Sayur Bening Bayam',
        estimated_portion: '1 piring Isi Piringku (~180 gram)',
        nutritional_facts: {
          calories_kcal: 285,
          protein_g: 13.8,
          carbohydrates_g: 34.0,
          fat_g: 9.5,
          fiber_g: 2.8,
        },
        key_micronutrients: [
          { nutrient: 'Omega-3 (DHA/EPA)', amount: '1.2 g', benefit_category: 'perkembangan kognitif & saraf otak' },
          { nutrient: 'Kalsium', amount: '120 mg', benefit_category: 'tulang & gigi pahlawan cilik' },
          { nutrient: 'Zat Besi', amount: '2.6 mg', benefit_category: 'energi dan pencegahan anemia' },
          { nutrient: 'Vitamin C', amount: '14 mg', benefit_category: 'penyerapan zat besi optimal' },
        ],
        stunting_prevention_score: 'Tinggi (Protein Hewani & Sayur Segar Seimbang)',
        child_growth_summary: 'Menu ideal pemenuhan Isi Piringku Kemenkes untuk daya pikir tajam dan pencegahan stunting.',
      },
    },
  },
  {
    id: 'ayam-kecap-tempe-sop',
    name: 'Ayam Suwir Kecap, Tempe & Sup Sayur',
    tag: 'Menu Keluarga',
    badge: 'Protein Lengkap Nabati & Hewani',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    description: 'Daging ayam tanpa lemak, tempe kedelai fermentasi kaya prebiotik, serta wortel dan brokoli segar.',
    estimatedPortion: '1 mangkuk lengkap (~190 gram)',
    mealType: 'makan_malam',
    isAnimalProteinSuperfood: true,
    precomputedAnalysis: {
      interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Ayam Suwir Kecap + Tempe + Sup Wortel Brokoli!
Yummy! Menu makan malam yang hangat dan sangat bergizi. Perpaduan protein hewani (ayam) dan protein nabati (tempe) saling melengkapi kebutuhan asam amino si kecil.

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- 🦴 **Otot Kuat & Pertumbuhan Sel (Protein Ayam & Tempe):** Mendukung regenerasi jaringan tubuh saat si kecil tidur lelap di malam hari.
- 🛡️ **Pencernaan Kuat (Probiotik Fermentasi Tempe):** Bakteri baik tempe menjaga usus tetap sehat sehingga nutrisi terserap maksimal!
- ✨ **Mata Cerah & Kulit Sehat (Beta-Karoten Wortel):** Menjaga kesehatan mata dari paparan layar dan sinar matahari.

💡 **Tips Seru NutriDe:**
Potong wortel menjadi bentuk bintang lucu menggunakan cetakan kecil agar makan malam menjadi momen petualangan menyenangkan bagi si kecil!`,
      dataJson: {
        is_food: true,
        food_name: 'Ayam Suwir Kecap, Tempe & Sup Sayur',
        estimated_portion: '1 mangkuk lengkap (~190 gram)',
        nutritional_facts: {
          calories_kcal: 290,
          protein_g: 14.5,
          carbohydrates_g: 31.0,
          fat_g: 10.0,
          fiber_g: 3.5,
        },
        key_micronutrients: [
          { nutrient: 'Seng (Zinc)', amount: '1.9 mg', benefit_category: 'percepatan tinggi badan' },
          { nutrient: 'Vitamin A', amount: '280 mcg', benefit_category: 'imunitas & kesehatan mata' },
          { nutrient: 'Kalsium', amount: '95 mg', benefit_category: 'tulang & gigi' },
          { nutrient: 'Zat Besi', amount: '2.1 mg', benefit_category: 'stamina anak' },
        ],
        stunting_prevention_score: 'Tinggi (Kombinasi Nutrisi Lengkap)',
        child_growth_summary: 'Sangat baik untuk mendukung pelepasan hormon pertumbuhan anak di malam hari.',
      },
    },
  },
  {
    id: 'alpukat-keju',
    name: 'Alpukat Keruk Madu & Keju Parut',
    tag: 'Lemak Sehat MPASI',
    badge: 'Booster Berat Badan',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description: 'Camilan padat gizi dengan lemak tak jenuh rantai tunggal dan kalsium tinggi dari keju cheddar.',
    estimatedPortion: '1 mangkuk kecil (~100 gram)',
    mealType: 'camilan_sore',
    isAnimalProteinSuperfood: true,
    precomputedAnalysis: {
      interactiveMessage: `🎉 **Tadaaa! Makanan Terdeteksi:** Alpukat Keruk & Keju Parut Gurih!
Camilan padat kalori dan lemak baik yang sangat disukai balita! Pilihan tepat jika Bunda sedang ingin menaikkan berat badan (BB booster) si kecil secara sehat.

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- ⚡ **Lemak Baik Otak (Asam Lemak Tak Jenuh):** Lemak esensial yang melapisi sel-sel saraf agar transfer sinyal di otak berjalan secepat kilat!
- 🦴 **Kalsium Juara (Keju Cheddar):** Tambahan keju memberikan asupan kalsium tinggi untuk gigi dan tulang yang kokoh.
- 🛡️ **Perut Kenyang & Nyaman (Serat Halus Alpukat):** Lembut untuk lambung balita dan membantu penyerapan vitamin larut lemak (A, D, E, K).

💡 **Tips Seru NutriDe:**
Untuk bayi di bawah 1 tahun, ganti madu dengan air matang atau ASI/sufor ya Bun. Tekstur creamy alpukat bisa dijadikan olesan pancake sehat!`,
      dataJson: {
        is_food: true,
        food_name: 'Alpukat Keruk Madu & Keju Parut',
        estimated_portion: '1 mangkuk kecil (~100 gram)',
        nutritional_facts: {
          calories_kcal: 210,
          protein_g: 4.8,
          carbohydrates_g: 13.5,
          fat_g: 16.5,
          fiber_g: 4.2,
        },
        key_micronutrients: [
          { nutrient: 'Kalsium', amount: '180 mg', benefit_category: 'kepadatan gigi & tulang' },
          { nutrient: 'Vitamin E', amount: '2.1 mg', benefit_category: 'antioksidan pelindung sel' },
          { nutrient: 'Folat', amount: '58 mcg', benefit_category: 'sintesis DNA dan sel baru' },
        ],
        stunting_prevention_score: 'Sedang - Tinggi (Sangat baik untuk BB Booster)',
        child_growth_summary: 'Asupan lemak sehat dan kalsium yang efektif mendukung kenaikan berat badan sehat pada anak.',
      },
    },
  },
];
