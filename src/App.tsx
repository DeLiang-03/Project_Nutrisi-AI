/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FoodScanner } from './components/FoodScanner';
import { DailyIntakeDashboard } from './components/DailyIntakeDashboard';
import { GrowthTracker } from './components/GrowthTracker';
import { StuntingEducation } from './components/StuntingEducation';
import { ChildProfileModal } from './components/ChildProfileModal';
import { ChildProfile, GrowthRecord, MealEntry } from './types/nutrition';
import {
  getStoredChildren,
  saveChildren,
  getActiveChildId,
  setActiveChildId,
  getStoredMeals,
  saveMeal,
  deleteMeal as deleteMealFromStorage,
  getStoredGrowthRecords,
  saveGrowthRecord,
} from './utils/storage';
import { Sparkles, Heart, Shield, Baby } from 'lucide-react';

export default function App() {
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildIdState] = useState<string>('');
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);

  const [activeTab, setActiveTab] = useState<'scanner' | 'dashboard' | 'growth' | 'education'>('scanner');
  const [showChildModal, setShowChildModal] = useState<boolean>(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedChildren = getStoredChildren();
    setChildrenList(loadedChildren);

    const initialActiveId = getActiveChildId();
    setActiveChildIdState(initialActiveId);

    const loadedMeals = getStoredMeals();
    setMeals(loadedMeals);

    const loadedGrowth = getStoredGrowthRecords();
    setGrowthRecords(loadedGrowth);
  }, []);

  const activeChild = childrenList.find((c) => c.id === activeChildId) || childrenList[0] || null;

  const handleSelectChild = (id: string) => {
    setActiveChildIdState(id);
    setActiveChildId(id);
  };

  const handleSaveMeal = (newMeal: MealEntry) => {
    saveMeal(newMeal);
    setMeals((prev) => [newMeal, ...prev]);
  };

  const handleDeleteMeal = (mealId: string) => {
    deleteMealFromStorage(mealId);
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleAddGrowthRecord = (record: GrowthRecord) => {
    saveGrowthRecord(record);
    setGrowthRecords((prev) => [...prev, record].sort((a, b) => a.ageMonths - b.ageMonths));
  };

  const handleSaveChildProfile = (child: ChildProfile) => {
    let updatedList: ChildProfile[];
    const exists = childrenList.some((c) => c.id === child.id);
    if (exists) {
      updatedList = childrenList.map((c) => (c.id === child.id ? child : c));
    } else {
      updatedList = [...childrenList, child];
    }
    setChildrenList(updatedList);
    saveChildren(updatedList);
    setActiveChildIdState(child.id);
    setActiveChildId(child.id);
    setEditingChild(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Navbar with child switcher & tab menu */}
      <Navbar
        childrenList={childrenList}
        activeChild={activeChild}
        onSelectChild={handleSelectChild}
        onOpenAddChild={() => {
          setEditingChild(null);
          setShowChildModal(true);
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scanner' && (
          <FoodScanner
            activeChild={activeChild}
            onSaveMeal={handleSaveMeal}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DailyIntakeDashboard
            activeChild={activeChild}
            meals={meals}
            onDeleteMeal={handleDeleteMeal}
            onGoToScanner={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthTracker
            activeChild={activeChild}
            growthRecords={growthRecords}
            onAddGrowthRecord={handleAddGrowthRecord}
            onUpdateChild={handleSaveChildProfile}
          />
        )}

        {activeTab === 'education' && <StuntingEducation />}
      </main>

      {/* Footer with NutriDe mascot note */}
      <footer className="mt-12 border-t border-amber-100 bg-white/70 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-gray-800">NutriDe Sahabat Anak</span>
            <span>• Maskot AI Analisis Visual Porsi & Gizi Balita Cegah Stunting</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-600">
            <span>Standar WHO 2006</span>
            <span>•</span>
            <span>Permenkes No. 28 / 2019 (AKG)</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Program Penurunan Stunting Nasional</span>
          </div>
        </div>
      </footer>

      {/* Child Profile Modal (Add / Edit) */}
      <ChildProfileModal
        isOpen={showChildModal}
        onClose={() => {
          setShowChildModal(false);
          setEditingChild(null);
        }}
        onSaveChild={handleSaveChildProfile}
        existingChild={editingChild}
      />
    </div>
  );
}
