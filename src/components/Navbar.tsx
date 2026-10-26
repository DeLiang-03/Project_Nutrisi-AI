import React from 'react';
import { ChildProfile } from '../types/nutrition';
import { calculateAge } from '../utils/growthStandards';
import { Sparkles, Camera, BarChart3, LineChart, BookOpen, PlusCircle, Baby, ShieldCheck } from 'lucide-react';
import mascotImg from '../assets/images/nutride_mascot_1792996779792.jpg';

interface NavbarProps {
  childrenList: ChildProfile[];
  activeChild: ChildProfile | null;
  onSelectChild: (id: string) => void;
  onOpenAddChild: () => void;
  activeTab: 'scanner' | 'dashboard' | 'growth' | 'education';
  onSelectTab: (tab: 'scanner' | 'dashboard' | 'growth' | 'education') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  childrenList,
  activeChild,
  onSelectChild,
  onOpenAddChild,
  activeTab,
  onSelectTab,
}) => {
  const ageInfo = activeChild ? calculateAge(activeChild.birthDate) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand with NutriDe Mascot */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md ring-2 ring-amber-100 shrink-0 transform hover:scale-105 transition-transform bg-amber-50">
              <img
                src={mascotImg}
                alt="NutriDe Maskot AI"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
                  NutriDe
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Sahabat Anak
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium hidden sm:block">
                Maskot AI Pemantau Gizi & Cegah Stunting
              </p>
            </div>
          </div>

          {/* Child Profile Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <label htmlFor="child-select" className="sr-only">Pilih Anak</label>
              <div className="flex items-center gap-2 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 rounded-2xl p-1.5 sm:px-3 sm:py-1.5 transition-all">
                {activeChild ? (
                  <img
                    src={activeChild.avatar}
                    alt={activeChild.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-amber-300"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                    <Baby className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-gray-800 leading-tight">
                    {activeChild?.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">
                    {ageInfo?.display}
                  </div>
                </div>
                <select
                  id="child-select"
                  value={activeChild?.id || ''}
                  onChange={(e) => onSelectChild(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer pr-1"
                >
                  {childrenList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({calculateAge(c.birthDate).display})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={onOpenAddChild}
              title="Tambah Data Anak"
              className="p-2 sm:px-3 sm:py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Anak Baru</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar border-t border-amber-50">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/70'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Makanan AI</span>
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Gizi Harian</span>
          </button>

          <button
            onClick={() => onSelectTab('growth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'growth'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/70'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Grafik Tumbuh Kembang (WHO)</span>
          </button>

          <button
            onClick={() => onSelectTab('education')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'education'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Panduan & Anti-Stunting</span>
            <span className="hidden lg:inline-flex text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-bold ml-1">
              Isi Piringku
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
