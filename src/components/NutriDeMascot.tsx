import React, { useState } from 'react';
import mascotImg from '../assets/images/nutride_mascot_1792996779792.jpg';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { speakNutriBotMessage } from '../utils/sound';

interface NutriDeMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGreeting?: boolean;
  childName?: string;
  isGtm?: boolean;
  className?: string;
}

const GREETINGS = [
  'Halo teman kecil! Aku NutriDe, siap membantumu jadi kuat dan tinggi!',
  'Makan makanan bergizi itu seru lho! Yuk kumpulkan kekuatan super hari ini!',
  'Satu butir telur dan ikan kembung bikin tulangmu sekuat pahlawan super!',
  'Jangan lupa habiskan lauk protein hewani hari ini ya!',
];

export const NutriDeMascot: React.FC<NutriDeMascotProps> = ({
  size = 'md',
  showGreeting = false,
  childName = 'Si Kecil',
  isGtm = false,
  className = '',
}) => {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const currentMessage = isGtm
    ? `Halo ${childName}! Sedang kurang nafsu makan ya? Tenang, NutriDe punya banyak trik makanan lezat dan seru!`
    : GREETINGS[currentGreetingIndex];

  const handleMascotClick = () => {
    setIsWaving(true);
    setCurrentGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    speakNutriBotMessage(currentMessage);
    setTimeout(() => setIsWaving(false), 800);
  };

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Mascot Avatar with lively animation */}
      <div
        onClick={handleMascotClick}
        title="Klik NutriDe untuk menyapa!"
        className={`relative cursor-pointer group transition-transform ${sizeClasses[size]}`}
      >
        <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border-2 border-amber-300 ring-4 ring-amber-100 group-hover:scale-105 group-hover:rotate-2 transition-all bg-amber-50">
          <img
            src={mascotImg}
            alt="Maskot AI NutriDe"
            className={`w-full h-full object-cover transition-transform ${isWaving ? 'animate-bounce' : ''}`}
          />
        </div>

        {/* Floating Sprout / Sparkle Badge */}
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] shadow-md border-2 border-white animate-pulse">
          🌱
        </div>
      </div>

      {/* Optional Speech Bubble Greeting */}
      {showGreeting && (
        <div className="relative flex-1 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-md">
          {/* Bubble Arrow */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-white" />

          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  NutriDe Berkata:
                </span>
                {isGtm && (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-800">
                    Mode GTM
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                &ldquo;{currentMessage}&rdquo;
              </p>
            </div>

            <button
              onClick={() => speakNutriBotMessage(currentMessage)}
              className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all shrink-0"
              title="Dengarkan Suara NutriDe"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
