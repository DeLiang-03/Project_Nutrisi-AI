import React, { useState } from 'react';
import { ChildProfile, GrowthRecord } from '../types/nutrition';
import { calculateAge, assessStunting, assessWeight } from '../utils/growthStandards';
import { Plus, TrendingUp, AlertTriangle, ShieldCheck, Calendar, Activity, CheckCircle, Info } from 'lucide-react';

interface GrowthTrackerProps {
  activeChild: ChildProfile | null;
  growthRecords: GrowthRecord[];
  onAddGrowthRecord: (record: GrowthRecord) => void;
  onUpdateChild: (child: ChildProfile) => void;
}

export const GrowthTracker: React.FC<GrowthTrackerProps> = ({
  activeChild,
  growthRecords,
  onAddGrowthRecord,
  onUpdateChild,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<'height' | 'weight'>('height');

  // Form states for new measurement
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newWeight, setNewWeight] = useState<string>(String(activeChild?.weightKg || 12.0));
  const [newHeight, setNewHeight] = useState<string>(String(activeChild?.heightCm || 87.0));
  const [newNotes, setNewNotes] = useState<string>('');

  if (!activeChild) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl border border-amber-100">
        <p className="text-sm font-semibold text-gray-500">Pilih profil anak terlebih dahulu.</p>
      </div>
    );
  }

  const ageInfo = calculateAge(activeChild.birthDate);
  const stuntingResult = assessStunting(ageInfo.months, activeChild.heightCm, activeChild.gender);
  const weightResult = assessWeight(ageInfo.months, activeChild.weightKg, activeChild.gender);

  // Filter growth records for active child
  const childRecords = growthRecords
    .filter((r) => r.childId === activeChild.id)
    .sort((a, b) => a.ageMonths - b.ageMonths);

  const handleSubmitMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    const h = parseFloat(newHeight);
    if (!w || !h) return;

    const newRecord: GrowthRecord = {
      id: `growth-${Date.now()}`,
      childId: activeChild.id,
      date: newDate,
      ageMonths: ageInfo.months,
      weightKg: w,
      heightCm: h,
      notes: newNotes,
    };

    onAddGrowthRecord(newRecord);

    // Also update current active child stats
    onUpdateChild({
      ...activeChild,
      weightKg: w,
      heightCm: h,
    });

    setShowAddModal(false);
    setNewNotes('');
  };

  // SVG Chart Dimensions & Scale calculations
  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const minAge = 0;
  const maxAge = 60; // 5 years

  // Height range 45cm to 120cm
  const minHeight = 45;
  const maxHeight = 120;

  // Weight range 2kg to 25kg
  const minWeight = 2;
  const maxWeight = 25;

  const scaleX = (age: number) =>
    padding.left + ((age - minAge) / (maxAge - minAge)) * (svgWidth - padding.left - padding.right);

  const scaleYHeight = (height: number) =>
    svgHeight - padding.bottom - ((height - minHeight) / (maxHeight - minHeight)) * (svgHeight - padding.top - padding.bottom);

  const scaleYWeight = (weight: number) =>
    svgHeight - padding.bottom - ((weight - minWeight) / (maxWeight - minWeight)) * (svgHeight - padding.top - padding.bottom);

  // Approximate WHO Median Line points (0 to 60 mo)
  const ages = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

  // WHO Length/Height curves for reference
  const medianHeightPoints = ages.map((a) => {
    const med = assessStunting(a, 0, activeChild.gender).medianHeightCm;
    return `${scaleX(a)},${scaleYHeight(med)}`;
  }).join(' ');

  const minus2SdHeightPoints = ages.map((a) => {
    const res = assessStunting(a, 0, activeChild.gender);
    const val = res.medianHeightCm - 2 * res.sdCm;
    return `${scaleX(a)},${scaleYHeight(val)}`;
  }).join(' ');

  const plus2SdHeightPoints = ages.map((a) => {
    const res = assessStunting(a, 0, activeChild.gender);
    const val = res.medianHeightCm + 2 * res.sdCm;
    return `${scaleX(a)},${scaleYHeight(val)}`;
  }).join(' ');

  // WHO Weight curves for reference
  const medianWeightPoints = ages.map((a) => {
    const med = assessWeight(a, 0, activeChild.gender).medianWeightKg;
    return `${scaleX(a)},${scaleYWeight(med)}`;
  }).join(' ');

  const minus2SdWeightPoints = ages.map((a) => {
    const med = assessWeight(a, 0, activeChild.gender).medianWeightKg;
    const val = Math.max(2, med - 2.5);
    return `${scaleX(a)},${scaleYWeight(val)}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Top Banner: Antropometri Status & Stunting Classification */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900">
                Status Pertumbuhan & Indeks Stunting WHO
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Kemenkes Standar 2020
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Analisis Z-Score tinggi badan menurut umur (TB/U) dan berat badan menurut umur (BB/U).
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Hasil Ukur Posyandu</span>
          </button>
        </div>

        {/* Status Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Card TB/U (Indeks Utama Stunting) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 to-orange-50/40 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Indeks TB/U (Pencegahan Stunting)
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${stuntingResult.badgeBg}`}>
                {stuntingResult.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-gray-900">{activeChild.heightCm}</span>
                <span className="text-xs font-bold text-gray-400 ml-1">cm</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-extrabold text-gray-700">Z-Score: {stuntingResult.zScore} SD</div>
                <div className="text-[11px] text-gray-400">Median Sebaya: {stuntingResult.medianHeightCm} cm</div>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-white/80 p-3 rounded-xl border border-amber-100/80 leading-relaxed font-medium">
              💡 <strong>Rekomendasi NutriDe:</strong> {stuntingResult.recommendation}
            </p>
          </div>

          {/* Card BB/U (Indeks Berat Badan) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-cyan-50/40 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Indeks BB/U (Berat Badan Anak)
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${weightResult.badgeBg}`}>
                {weightResult.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-gray-900">{activeChild.weightKg}</span>
                <span className="text-xs font-bold text-gray-400 ml-1">kg</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-extrabold text-gray-700">Z-Score: {weightResult.zScore} SD</div>
                <div className="text-[11px] text-gray-400">Median Sebaya: {weightResult.medianWeightKg} kg</div>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-white/80 p-3 rounded-xl border border-blue-100/80 leading-relaxed font-medium">
              💡 <strong>Kondisi Gizi:</strong> Berat badan {weightResult.status.toLowerCase()}. Terus pantau kenaikan timbangan minimal 200-300g per bulan di Posyandu.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Growth Curve Graph (WHO Standard Curves) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Kurva Pertumbuhan Anak Standar WHO (0 - 5 Tahun)
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Titik oranye menunjukkan riwayat pengukuran {activeChild.name} terhadap kurva standar.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200">
            <button
              onClick={() => setActiveChart('height')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeChart === 'height' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              Tinggi Badan (TB/U)
            </button>
            <button
              onClick={() => setActiveChart('weight')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeChart === 'weight' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
              }`}
            >
              Berat Badan (BB/U)
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
            <span>Median Standar (0 SD)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block border-t border-dashed" />
            <span>Batas Normal (-2 SD & +2 SD)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block ring-2 ring-white" />
            <span>Posisi {activeChild.name}</span>
          </div>
        </div>

        {/* SVG Curve Rendering */}
        <div className="w-full overflow-x-auto bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[500px] h-auto font-sans">
            {/* Grid Lines */}
            {ages.map((a) => (
              <g key={`grid-x-${a}`}>
                <line
                  x1={scaleX(a)}
                  y1={padding.top}
                  x2={scaleX(a)}
                  y2={svgHeight - padding.bottom}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={scaleX(a)}
                  y={svgHeight - padding.bottom + 16}
                  fontSize="10"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  {a} bln
                </text>
              </g>
            ))}

            {/* Standard Curve Lines */}
            {activeChart === 'height' ? (
              <>
                {/* Plus 2 SD */}
                <polyline fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3" points={plus2SdHeightPoints} />
                {/* Median */}
                <polyline fill="none" stroke="#10B981" strokeWidth="2.5" points={medianHeightPoints} />
                {/* Minus 2 SD (Stunting threshold) */}
                <polyline fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" points={minus2SdHeightPoints} />

                {/* Stunting Zone Label */}
                <text x={scaleX(45)} y={scaleYHeight(assessStunting(45, 0, activeChild.gender).medianHeightCm - 2 * 3.8) + 14} fontSize="9" fill="#EF4444" fontWeight="bold">
                  Batas Stunting (-2 SD)
                </text>
                <text x={scaleX(45)} y={scaleYHeight(assessStunting(45, 0, activeChild.gender).medianHeightCm) - 8} fontSize="9" fill="#10B981" fontWeight="bold">
                  Median Standar (0 SD)
                </text>

                {/* Child Plot Points */}
                {childRecords.map((rec) => {
                  const cx = scaleX(rec.ageMonths);
                  const cy = scaleYHeight(rec.heightCm);
                  return (
                    <g key={rec.id}>
                      <circle cx={cx} cy={cy} r="6" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" className="shadow-md" />
                      <text x={cx} y={cy - 10} fontSize="10" fontWeight="bold" fill="#881337" textAnchor="middle">
                        {rec.heightCm} cm
                      </text>
                    </g>
                  );
                })}
              </>
            ) : (
              <>
                {/* Median */}
                <polyline fill="none" stroke="#10B981" strokeWidth="2.5" points={medianWeightPoints} />
                {/* Minus 2 SD */}
                <polyline fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" points={minus2SdWeightPoints} />

                {/* Child Plot Points */}
                {childRecords.map((rec) => {
                  const cx = scaleX(rec.ageMonths);
                  const cy = scaleYWeight(rec.weightKg);
                  return (
                    <g key={rec.id}>
                      <circle cx={cx} cy={cy} r="6" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={cx} y={cy - 10} fontSize="10" fontWeight="bold" fill="#881337" textAnchor="middle">
                        {rec.weightKg} kg
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Measurement History Table */}
      <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          Riwayat Penimbangan & Pengukuran Berkala
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-2.5">Tanggal</th>
                <th className="pb-2.5">Usia Anak</th>
                <th className="pb-2.5">Tinggi Badan</th>
                <th className="pb-2.5">Berat Badan</th>
                <th className="pb-2.5">Indeks Stunting (TB/U)</th>
                <th className="pb-2.5">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {childRecords.map((rec) => {
                const assess = assessStunting(rec.ageMonths, rec.heightCm, activeChild.gender);
                return (
                  <tr key={rec.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 font-bold text-gray-900">{rec.date}</td>
                    <td className="py-2.5">{rec.ageMonths} bulan</td>
                    <td className="py-2.5 font-bold text-amber-800">{rec.heightCm} cm</td>
                    <td className="py-2.5 font-bold text-blue-800">{rec.weightKg} kg</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${assess.badgeBg}`}>
                        {assess.status} ({assess.zScore} SD)
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400">{rec.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Growth Measurement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-amber-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                Catat Pengukuran Baru ({activeChild.name})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMeasurement} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Tanggal Pengukuran:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Tinggi Badan (cm):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="40"
                    max="140"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Berat Badan (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="40"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Tambahan (Opsional):</label>
                <input
                  type="text"
                  placeholder="Misal: Posyandu Mawar, sudah imunisasi Campak"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Simpan Pengukuran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
