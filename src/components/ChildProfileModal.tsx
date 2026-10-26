import React, { useState } from 'react';
import { ChildProfile, Gender } from '../types/nutrition';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChild: (child: ChildProfile) => void;
  existingChild?: ChildProfile | null;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=300&q=80',
];

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveChild,
  existingChild,
}) => {
  const [name, setName] = useState<string>(existingChild?.name || '');
  const [gender, setGender] = useState<Gender>(existingChild?.gender || 'male');
  const [birthDate, setBirthDate] = useState<string>(existingChild?.birthDate || '2024-09-01');
  const [weightKg, setWeightKg] = useState<string>(String(existingChild?.weightKg || 12.0));
  const [heightCm, setHeightCm] = useState<string>(String(existingChild?.heightCm || 86.0));
  const [allergiesText, setAllergiesText] = useState<string>(existingChild?.allergies.join(', ') || '');
  const [isGtm, setIsGtm] = useState<boolean>(existingChild?.isGtm || false);
  const [notes, setNotes] = useState<string>(existingChild?.notes || '');
  const [avatar, setAvatar] = useState<string>(existingChild?.avatar || AVATAR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const allergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const childData: ChildProfile = {
      id: existingChild?.id || `child-${Date.now()}`,
      name: name.trim(),
      gender,
      birthDate,
      weightKg: parseFloat(weightKg) || 12.0,
      heightCm: parseFloat(heightCm) || 86.0,
      avatar,
      allergies,
      isGtm,
      notes: notes.trim(),
    };

    onSaveChild(childData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-amber-200">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-base font-black text-gray-900">
            {existingChild ? 'Edit Profil Anak' : 'Tambah Profil Anak Baru'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-gray-700">
          {/* Avatar Selector */}
          <div>
            <label className="font-bold text-gray-800 block mb-1.5">Pilih Foto Profil:</label>
            <div className="flex items-center gap-2">
              {AVATAR_OPTIONS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx}`}
                  onClick={() => setAvatar(url)}
                  className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition-all ${
                    avatar === url ? 'border-amber-500 ring-2 ring-amber-300 scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Nama Lengkap Anak:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Muhammad Al Fatih"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Jenis Kelamin:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="male">Laki-laki 👦</option>
                <option value="female">Perempuan 👧</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-800 block mb-1">Tanggal Lahir:</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Berat Badan (kg):</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-800 block mb-1">Tinggi Badan (cm):</label>
              <input
                type="number"
                step="0.1"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Riwayat Alergi (Pisahkan koma):</label>
            <input
              type="text"
              placeholder="Misal: Alergi udang, telur asin"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-rose-50 rounded-xl border border-rose-200">
            <input
              type="checkbox"
              id="gtm-check"
              checked={isGtm}
              onChange={(e) => setIsGtm(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-rose-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="gtm-check" className="cursor-pointer">
              <span className="font-bold text-rose-900 block">Sedang Mengalami GTM (Gerakan Tutup Mulut)</span>
              <span className="text-[10px] text-rose-700">NutriBot akan otomatis memberi saran resep & stimulasi nafsu makan</span>
            </label>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Catatan Kebiasaan Makan (Opsional):</label>
            <textarea
              rows={2}
              placeholder="Contoh: Suka makan buah manis, agak susah jika makan sayur hijau pahit"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-xs"
            >
              Simpan Profil Anak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
