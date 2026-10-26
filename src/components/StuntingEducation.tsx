import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Apple, Fish, Utensils } from 'lucide-react';

export const StuntingEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'isi_piringku' | 'superfoods' | 'gtm_tips' | 'hpk'>('isi_piringku');

  const superfoods = [
    {
      name: 'Telur Ayam / Telur Puyuh',
      icon: '🥚',
      badge: 'Nilai Cerna 100%',
      benefits: 'Asam amino esensial lengkap dan kolin untuk otak. Rekomendasi Kemenkes: 1 butir telur per hari untuk setiap balita!',
      priority: 'Wajib Harian',
      color: 'bg-amber-50 border-amber-200',
    },
    {
      name: 'Hati Ayam Kampung / Broiler',
      icon: '🍗',
      badge: 'Juara Zat Besi Heme',
      benefits: 'Zat besi tipe heme paling cepat diserap tubuh anak untuk mencegah anemia. 1 potong hati ayam mencukupi kebutuhan zat besi 2 hari!',
      priority: '2-3x per minggu',
      color: 'bg-rose-50 border-rose-200',
    },
    {
      name: 'Ikan Kembung Lokal',
      icon: '🐟',
      badge: 'DHA > Salmon Impor',
      benefits: 'Kaya asam lemak Omega-3, DHA, dan EPA untuk kecerdasan sel saraf otak serta kalsium dari duri lunaknya.',
      priority: '2-3x per minggu',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      name: 'Ikan Teri Nasi Segar / Kering Tawar',
      icon: '🌊',
      badge: 'Super Kalsium Tulang',
      benefits: 'Dimakan bersama tulang halusnya, memberikan kalsium alami terbaik untuk percepatan tinggi badan balita.',
      priority: 'Variasi lauk',
      color: 'bg-teal-50 border-teal-200',
    },
    {
      name: 'Daging Sapi Cincang',
      icon: '🥩',
      badge: 'Kaya Seng (Zinc)',
      benefits: 'Zinc berperan langsung memicu pelepasan hormon pertumbuhan linier tulang (Insulin-like Growth Factor-1).',
      priority: '1-2x per minggu',
      color: 'bg-red-50 border-red-200',
    },
    {
      name: 'Tempe & Tahu Kedelai',
      icon: '🌾',
      badge: 'Prebiotik Alami',
      benefits: 'Hasil fermentasi kedelai yang mudah dicerna usus anak, menyehatkan mikrobioma saluran cerna agar nutrisi terserap tuntas.',
      priority: 'Pendamping harian',
      color: 'bg-yellow-50 border-yellow-200',
    },
  ];

  const gtmTips = [
    {
      number: '1',
      title: 'Terapkan Aturan Makan Konsisten (Feeding Rules)',
      desc: 'Beri jeda 2-3 jam antara waktu makan utama dan camilan. Jangan beri susu berlebih atau camilan manis mendekati jam makan agar anak lapar alami.',
    },
    {
      number: '2',
      title: 'Batasi Waktu Makan Maksimal 30 Menit',
      desc: 'Selesaikan sesi makan setelah 30 menit, habis maupun tidak habis. Hindari membiarkan piring di depan anak berjam-jam yang membuat anak trauma.',
    },
    {
      number: '3',
      title: 'Bebaskan Distraksi (No Gadget / TV)',
      desc: 'Matikan ponsel, tablet, dan televisi saat makan. Latih anak untuk fokus pada rasa, tekstur, dan warna makanan di piringnya.',
    },
    {
      number: '4',
      title: 'Variasikan Bentuk & Warna Penyajian',
      desc: 'Cetak nasi berbentuk bola atau hewan lucu, buat sup sayur warna-warni, atau sajikan finger food yang bisa digenggam si kecil sendiri.',
    },
    {
      number: '5',
      title: 'Jangan Memaksa / Mengancam',
      desc: 'Makan adalah proses belajar yang menyenangkan. Jika anak menolak satu jenis sayur, tawarkan kembali 10-15 kali di hari berbeda dengan olahan lain.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-7 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panduan Edukasi Kemenkes RI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Kunci Emas Pencegahan Stunting Anak
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
            Stunting bukan hanya soal tubuh pendek, melainkan terhambatnya perkembangan kognitif otak anak. Pencegahan stunting paling efektif berakar pada asupan protein hewani dan responsive feeding.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-amber-100 shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('isi_piringku')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'isi_piringku' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Isi Piringku Balita</span>
        </button>
        <button
          onClick={() => setActiveTab('superfoods')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'superfoods' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Superfood Anti-Stunting</span>
        </button>
        <button
          onClick={() => setActiveTab('gtm_tips')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'gtm_tips' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Solusi Anak GTM</span>
        </button>
        <button
          onClick={() => setActiveTab('hpk')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'hpk' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-amber-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>1000 Hari Pertama (HPK)</span>
        </button>
      </div>

      {/* Tab Content 1: Isi Piringku */}
      {activeTab === 'isi_piringku' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Visual Plate Graphic */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-amber-300 bg-amber-50 relative flex items-center justify-center shrink-0 shadow-inner overflow-hidden p-3">
              {/* Plate Segments */}
              <div className="w-full h-full rounded-full relative overflow-hidden flex flex-col">
                {/* Top Half: 35% Makanan Pokok + 35% Lauk Pauk */}
                <div className="h-1/2 flex border-b-2 border-dashed border-amber-400">
                  <div className="w-1/2 bg-amber-200/90 flex flex-col items-center justify-center p-2 text-center border-r-2 border-dashed border-amber-400">
                    <span className="text-2xl">🍚</span>
                    <span className="text-xs font-black text-amber-950">35% Pokok</span>
                    <span className="text-[10px] text-amber-800">Nasi / Kentang</span>
                  </div>
                  <div className="w-1/2 bg-rose-200/90 flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-2xl">🍗</span>
                    <span className="text-xs font-black text-rose-950">35% Lauk Pauk</span>
                    <span className="text-[10px] text-rose-800 font-bold">Protein Hewani ⭐</span>
                  </div>
                </div>
                {/* Bottom Half: 30% Sayur dan Buah */}
                <div className="h-1/2 bg-emerald-200/90 flex items-center justify-center p-2 text-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🥦</span>
                    <span className="text-xs font-black text-emerald-950">Sayur Mayur</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">+</span>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🍌</span>
                    <span className="text-xs font-black text-emerald-950">Buah Segar</span>
                    <span className="text-[10px] text-emerald-800 font-semibold">(Total 30%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-3.5 flex-1">
              <h3 className="text-lg font-black text-gray-900">
                Porsi Ideal Sekali Makan Balita (Kemenkes RI)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Berbeda dengan porsi orang dewasa, <strong>balita membutuhkan proporsi lauk pauk protein hewani yang jauh lebih besar (35%)</strong> untuk memicu pembelahan sel-sel tulang rawan epifisis yang membuat anak cepat tinggi.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-xl">🥩</span>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">Lauk Pauk (35% Piring)</h4>
                    <p className="text-[11px] text-rose-800">
                      Minimal ada 1 macam protein hewani (Telur, Ikan, Hati, Daging sapi, Ayam) ditambah protein nabati (Tempe, Tahu).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xl">🍚</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">Makanan Pokok (35% Piring)</h4>
                    <p className="text-[11px] text-amber-800">
                      Nasi pulen, bubur tim lembut, kentang tumbuk (mashed potato), atau ubi manis sebagai penghasil energi gerak.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xl">🥗</span>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Sayur & Buah (30% Piring)</h4>
                    <p className="text-[11px] text-emerald-800">
                      Bayam, brokoli, wortel, labu siam dipadu buah segar (pepaya, pisang, jeruk manis) untuk serat dan vitamin C.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Superfoods */}
      {activeTab === 'superfoods' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-medium bg-amber-50 p-3 rounded-2xl border border-amber-200">
            ⭐ <strong>Superfood Lokal:</strong> Tidak perlu bahan makanan impor mahal. Sumber gizi terbaik pencegah stunting justru melimpah dan murah di pasar tradisional Indonesia!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {superfoods.map((food, idx) => (
              <div key={idx} className={`p-4 rounded-3xl border ${food.color} space-y-2.5 shadow-xs`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{food.icon}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-gray-800 border border-gray-200">
                    {food.priority}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 leading-tight">{food.name}</h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-white/70 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                    {food.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {food.benefits}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: GTM Tips */}
      {activeTab === 'gtm_tips' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-xs space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl shrink-0">
              🥣
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                5 Jurus Ampuh Mengatasi Anak GTM (Gerakan Tutup Mulut)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Panduan praktis Ikatan Dokter Anak Indonesia (IDAI) saat si kecil mogok makan atau melempar sendok.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {gtmTips.map((tip) => (
              <div key={tip.number} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {tip.number}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed font-medium">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: 1000 HPK */}
      {activeTab === 'hpk' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-xs space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl shrink-0">
              👶
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                1000 Hari Pertama Kehidupan (0 - 2 Tahun)
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Periode emas (Window of Opportunity) yang menentukan kualitas kesehatan, imunitas, dan kecerdasan anak seumur hidup.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider block">
                Fase 1: Kehamilan (270 Hari)
              </span>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Ibu hamil wajib minum Tablet Tambah Darah (TTD) minimal 90 butir, konsumsi telur dan ikan setiap hari untuk mencegah bayi lahir dengan Berat Badan Lahir Rendah (BBLR).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider block">
                Fase 2: Usia 0 - 6 Bulan (180 Hari)
              </span>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                ASI Eksklusif tanpa tambahan makanan atau air putih apapun. Kolostrum (ASI pertama) adalah vaksin alami terbaik bagi bayi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                Fase 3: Usia 6 - 24 Bulan (550 Hari)
              </span>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Pemberian MPASI adekuat kaya protein hewani ganda (telur + hati/ikan/daging). Di fase inilah risiko stunting paling rawan terjadi jika MPASI kurang berkualitas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
