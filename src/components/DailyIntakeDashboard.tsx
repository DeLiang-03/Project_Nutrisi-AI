import React, { useState } from 'react';
import { ChildProfile, MealEntry } from '../types/nutrition';
import { calculateAge, getDailyAKGTarget } from '../utils/growthStandards';
import { Plus, Trash2, Calendar, ShieldCheck, AlertCircle, Sparkles, Download, CheckCircle, Clock } from 'lucide-react';
import mascotImg from '../assets/images/nutride_mascot_1792996779792.jpg';

interface DailyIntakeDashboardProps {
  activeChild: ChildProfile | null;
  meals: MealEntry[];
  onDeleteMeal: (mealId: string) => void;
  onGoToScanner: () => void;
}

export const DailyIntakeDashboard: React.FC<DailyIntakeDashboardProps> = ({
  activeChild,
  meals,
  onDeleteMeal,
  onGoToScanner,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMealDetail, setSelectedMealDetail] = useState<MealEntry | null>(null);

  if (!activeChild) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl border border-amber-100">
        <p className="text-sm font-semibold text-gray-500">Pilih profil anak terlebih dahulu.</p>
      </div>
    );
  }

  const ageInfo = calculateAge(activeChild.birthDate);
  const akgTarget = getDailyAKGTarget(ageInfo.months);

  // Filter meals by child and selected date
  const filteredMeals = meals.filter(
    (m) => m.childId === activeChild.id && m.date === selectedDate
  );

  // Calculate totals
  const totalCalories = filteredMeals.reduce((acc, m) => acc + (m.nutritionalFacts.calories_kcal || 0), 0);
  const totalProtein = Math.round(filteredMeals.reduce((acc, m) => acc + (m.nutritionalFacts.protein_g || 0), 0) * 10) / 10;
  const totalCarbs = Math.round(filteredMeals.reduce((acc, m) => acc + (m.nutritionalFacts.carbohydrates_g || 0), 0) * 10) / 10;
  const totalFat = Math.round(filteredMeals.reduce((acc, m) => acc + (m.nutritionalFacts.fat_g || 0), 0) * 10) / 10;
  const totalFiber = Math.round(filteredMeals.reduce((acc, m) => acc + (m.nutritionalFacts.fiber_g || 0), 0) * 10) / 10;

  // Count animal protein meals
  const animalProteinMeals = filteredMeals.filter((m) => m.hasAnimalProtein);
  const hasMetAnimalProtein = animalProteinMeals.length >= 1;

  // Percentage calculations
  const calPercent = Math.min(100, Math.round((totalCalories / akgTarget.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / akgTarget.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / akgTarget.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / akgTarget.fat) * 100));

  const handleExportJson = () => {
    const report = {
      child: {
        name: activeChild.name,
        age: ageInfo.display,
        weightKg: activeChild.weightKg,
        heightCm: activeChild.heightCm,
      },
      date: selectedDate,
      summary: {
        calories: `${totalCalories} / ${akgTarget.calories} kkal (${calPercent}%)`,
        protein: `${totalProtein} / ${akgTarget.protein} g (${proteinPercent}%)`,
        carbs: `${totalCarbs} / ${akgTarget.carbs} g`,
        fat: `${totalFat} / ${akgTarget.fat} g`,
        animalProteinMealsCount: animalProteinMeals.length,
      },
      meals: filteredMeals.map((m) => ({
        time: m.time,
        mealType: m.mealType,
        foodName: m.foodName,
        portion: m.estimatedPortion,
        nutrition: m.nutritionalFacts,
        stuntingScore: m.stuntingPreventionScore,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Gizi_${activeChild.name.replace(/\s+/g, '_')}_${selectedDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMealTypeBadge = (type: string) => {
    switch (type) {
      case 'sarapan':
        return { label: 'Sarapan Pagi', bg: 'bg-amber-100 text-amber-800' };
      case 'camilan_pagi':
        return { label: 'Snack Pagi', bg: 'bg-emerald-100 text-emerald-800' };
      case 'makan_siang':
        return { label: 'Makan Siang', bg: 'bg-blue-100 text-blue-800' };
      case 'camilan_sore':
        return { label: 'Snack Sore', bg: 'bg-purple-100 text-purple-800' };
      case 'makan_malam':
        return { label: 'Makan Malam', bg: 'bg-indigo-100 text-indigo-800' };
      default:
        return { label: type, bg: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span>Log Asupan & Target Gizi Harian</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Pemantauan pemenuhan AKG (Angka Kecukupan Gizi) standar Kemenkes RI untuk pencegahan stunting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Shortcuts */}
          <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDate === todayStr ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              Hari Ini
            </button>
            <div className="flex items-center gap-1.5 px-2">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleExportJson}
            disabled={filteredMeals.length === 0}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Unduh Data JSON Laporan Posyandu/Dokter"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor Data</span>
          </button>

          <button
            onClick={onGoToScanner}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Makanan Baru</span>
          </button>
        </div>
      </div>

      {/* Special Stunting Critical Indicator: Protein Hewani */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          hasMetAnimalProtein
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                hasMetAnimalProtein ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Kunci Anti-Stunting Kemenkes
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    hasMetAnimalProtein ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {hasMetAnimalProtein ? 'TERPENUHI ⭐' : 'PERHATIAN ⚠️'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-gray-900 mt-0.5">
                {hasMetAnimalProtein
                  ? `Hebat! ${activeChild.name} sudah mendapat asupan protein hewani hari ini.`
                  : `Ingat Bunda: ${activeChild.name} belum tercatat mengonsumsi protein hewani hari ini!`}
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                {hasMetAnimalProtein
                  ? `Tercatat ${animalProteinMeals.length} menu kaya protein hewani (asam amino esensial) yang langsung memacu pertambahan tinggi badan dan sel otak.`
                  : `Kemenkes merekomendasikan minimal 1 butir telur atau 1 porsi ikan/ayam/hati/daging setiap hari untuk mencegah perlambatan pertumbuhan linier (stunting).`}
              </p>
            </div>
          </div>

          {!hasMetAnimalProtein && (
            <button
              onClick={onGoToScanner}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 self-start sm:self-auto"
            >
              Foto Menu Protein Hewani
            </button>
          )}
        </div>
      </div>

      {/* Progress Cards: Makronutrisi vs AKG Standar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Energi / Kalori</span>
            <span className="text-xs font-extrabold text-amber-600">{calPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{totalCalories}</span>
            <span className="text-xs text-gray-400">/ {akgTarget.calories} kkal</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                calPercent >= 80 ? 'bg-emerald-500' : calPercent >= 50 ? 'bg-amber-500' : 'bg-orange-500'
              }`}
              style={{ width: `${calPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            Kebutuhan usia {ageInfo.display}: ~{akgTarget.calories} kkal/hari
          </p>
        </div>

        {/* Protein Card */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Protein Total</span>
            <span className="text-xs font-extrabold text-rose-600">{proteinPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{totalProtein}</span>
            <span className="text-xs text-gray-400">/ {akgTarget.protein} g</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                proteinPercent >= 80 ? 'bg-emerald-500' : proteinPercent >= 50 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            Prioritas: Minimal {akgTarget.animalProteinTarget}g protein hewani
          </p>
        </div>

        {/* Carbohydrates Card */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Karbohidrat</span>
            <span className="text-xs font-extrabold text-blue-600">{carbsPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">{totalCarbs}</span>
            <span className="text-xs text-gray-400">/ {akgTarget.carbs} g</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                carbsPercent >= 80 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Bahan bakar gerak motorik anak</p>
        </div>

        {/* Fat & Fiber Card */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Lemak & Serat</span>
            <span className="text-xs font-extrabold text-amber-600">{fatPercent}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div>
              <span className="text-lg font-black text-gray-900">{totalFat}</span>
              <span className="text-[10px] text-gray-400">/ {akgTarget.fat}g lemak</span>
            </div>
            <span className="text-gray-300">•</span>
            <div>
              <span className="text-lg font-black text-emerald-700">{totalFiber}</span>
              <span className="text-[10px] text-gray-400">/ {akgTarget.fiber}g serat</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Lemak tak jenuh sangat baik untuk otak</p>
        </div>
      </div>

      {/* Meals Log Table / Timeline */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-gray-900">
              Riwayat Makanan Tanggal {selectedDate} ({filteredMeals.length} Makanan)
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">
            Klik kartu untuk membaca pesan & tips NutriBot
          </span>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl">
              🍽️
            </div>
            <h4 className="text-sm font-bold text-gray-800">Belum Ada Makanan Tercatat Pada Tanggal Ini</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Ambil foto sarapan, makan siang, atau camilan si kecil agar otomatis teranalisis dan tercatat di sini.
            </p>
            <button
              onClick={onGoToScanner}
              className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Foto Makanan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMeals.map((meal) => {
              const badge = getMealTypeBadge(meal.mealType);
              return (
                <div
                  key={meal.id}
                  className="p-4 sm:p-5 hover:bg-amber-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div
                    className="flex items-start gap-3.5 cursor-pointer flex-1"
                    onClick={() => setSelectedMealDetail(meal)}
                  >
                    {meal.image ? (
                      <img
                        src={meal.image}
                        alt={meal.foodName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shrink-0">
                        🍲
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">Pukul {meal.time}</span>
                        {meal.hasAnimalProtein && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ⭐ Protein Hewani
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-gray-900 leading-tight">
                        {meal.foodName}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">Porsi: {meal.estimatedPortion}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          🔥 {meal.nutritionalFacts.calories_kcal} kkal
                        </span>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                          🥩 {meal.nutritionalFacts.protein_g}g Protein
                        </span>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          🍚 {meal.nutritionalFacts.carbohydrates_g}g Karbo
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          🛡️ Skor: {meal.stuntingPreventionScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedMealDetail(meal)}
                      className="px-3 py-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all"
                    >
                      Lihat Respon NutriDe
                    </button>
                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus Makanan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detail Respon NutriDe */}
      {selectedMealDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-amber-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-300 bg-amber-50 shrink-0">
                  <img src={mascotImg} alt="NutriDe" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {selectedMealDetail.foodName}
                  </h3>
                  <span className="text-xs text-amber-700 font-semibold">
                    Respon & Tips NutriDe • {selectedMealDetail.date} ({selectedMealDetail.time})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMealDetail(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {selectedMealDetail.image && (
              <img
                src={selectedMealDetail.image}
                alt={selectedMealDetail.foodName}
                className="w-full h-44 rounded-2xl object-cover border border-gray-100"
              />
            )}

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
              {selectedMealDetail.interactiveMessage}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedMealDetail(null)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
