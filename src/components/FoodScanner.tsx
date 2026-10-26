import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Camera, RefreshCw, Upload, Sparkles, Volume2, VolumeX, CheckCircle2, Shield, Heart, Info, Copy, Check, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { ChildProfile, MealEntry, MealType } from '../types/nutrition';
import { SAMPLE_FOODS, SampleFood } from '../data/sampleFoods';
import { calculateAge } from '../utils/growthStandards';
import { speakNutriBotMessage, stopSpeaking } from '../utils/sound';
import { NutriDeMascot } from './NutriDeMascot';
import mascotImg from '../assets/images/nutride_mascot_1792996779792.jpg';

interface FoodScannerProps {
  activeChild: ChildProfile | null;
  onSaveMeal: (meal: MealEntry) => void;
  onGoToDashboard: () => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({
  activeChild,
  onSaveMeal,
  onGoToDashboard,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'samples'>('samples');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('sarapan');
  const [isGtmMode, setIsGtmMode] = useState<boolean>(activeChild?.isGtm || false);
  const [userNotes, setUserNotes] = useState<string>('');

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    interactiveMessage: string;
    dataJson: any;
    rawText?: string;
  } | null>(null);

  const [activeResultTab, setActiveResultTab] = useState<'interactive' | 'json'>('interactive');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Start camera when camera mode is active
  useEffect(() => {
    if (activeMode === 'camera' && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      stopSpeaking();
    };
  }, [activeMode, cameraFacing, capturedImage]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan mode Unggah Foto / Sampel.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleFood) => {
    setCapturedImage(sample.imageUrl);
    setSelectedMealType(sample.mealType);
    setResult(sample.precomputedAnalysis);
    setIsSaved(false);
  };

  const handleRunAnalysis = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setResult(null);
    setIsSaved(false);

    try {
      const ageInfo = activeChild ? calculateAge(activeChild.birthDate) : { display: '2 tahun', months: 24 };

      const payload = {
        imageBase64: capturedImage,
        childContext: {
          name: activeChild?.name || 'Si Kecil',
          ageMonths: ageInfo.months,
          ageDisplay: ageInfo.display,
          gender: activeChild?.gender || 'male',
          weightKg: activeChild?.weightKg || 12,
          heightCm: activeChild?.heightCm || 87,
          mealType: selectedMealType,
          notes: isGtmMode ? `Sedang GTM / Pilih-pilih makanan. ${userNotes}` : userNotes,
        },
      };

      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memproses visual makanan.');
      }

      setResult({
        interactiveMessage: data.interactiveMessage,
        dataJson: data.dataJson,
        rawText: data.rawText,
      });

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err?.message || 'Koneksi ke AI terputus. Pastikan koneksi stabil.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (result?.interactiveMessage) {
      setIsSpeaking(true);
      speakNutriBotMessage(result.interactiveMessage, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleCopyJson = () => {
    if (result?.dataJson) {
      navigator.clipboard.writeText(JSON.stringify(result.dataJson, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleSaveToDailyLog = () => {
    if (!result?.dataJson || !activeChild) return;

    const data = result.dataJson;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const foodNameLower = (data.food_name || '').toLowerCase();
    const hasAnimal =
      foodNameLower.includes('ayam') ||
      foodNameLower.includes('telur') ||
      foodNameLower.includes('ikan') ||
      foodNameLower.includes('daging') ||
      foodNameLower.includes('sapi') ||
      foodNameLower.includes('udang') ||
      foodNameLower.includes('keju') ||
      foodNameLower.includes('susu') ||
      foodNameLower.includes('hati');

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      childId: activeChild.id,
      date: dateStr,
      time: timeStr,
      mealType: selectedMealType,
      image: capturedImage || undefined,
      foodName: data.food_name || 'Makanan Sehat',
      estimatedPortion: data.estimated_portion || '1 porsi anak',
      interactiveMessage: result.interactiveMessage,
      nutritionalFacts: data.nutritional_facts || {
        calories_kcal: 0,
        protein_g: 0,
        carbohydrates_g: 0,
        fat_g: 0,
        fiber_g: 0,
      },
      keyMicronutrients: data.key_micronutrients || [],
      stuntingPreventionScore: data.stunting_prevention_score || 'Sedang',
      childGrowthSummary: data.child_growth_summary || 'Makanan baik untuk pertumbuhan.',
      hasAnimalProtein: hasAnimal,
      createdAt: now.toISOString(),
    };

    onSaveMeal(newMeal);
    setIsSaved(true);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  const mealTypeLabels: Record<MealType, { label: string; icon: string }> = {
    sarapan: { label: 'Sarapan Pagi', icon: '🌅' },
    camilan_pagi: { label: 'Snack Pagi', icon: '🍎' },
    makan_siang: { label: 'Makan Siang', icon: '☀️' },
    camilan_sore: { label: 'Snack Sore', icon: '🥑' },
    makan_malam: { label: 'Makan Malam', icon: '🌙' },
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with NutriDe AI Mascot */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              NutriDe • Maskot AI Pencegah Stunting
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Kenalkan NutriDe, Pahlawan Gizi Si Kecil!
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 font-medium leading-relaxed">
              Foto makanan piring si kecil, NutriDe akan menganalisis porsi, menghitung makronutrisi & zat besi/protein hewani, lalu menyapa dengan tips seru anti-GTM!
            </p>

            {activeChild && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold bg-black/15 backdrop-blur-md px-3.5 py-2 rounded-2xl w-fit">
                <span>Menganalisis untuk:</span>
                <span className="font-bold text-amber-200">{activeChild.name}</span>
                <span className="text-white/60">•</span>
                <span>{calculateAge(activeChild.birthDate).display}</span>
                <span className="text-white/60">•</span>
                <span>BB {activeChild.weightKg} kg / TB {activeChild.heightCm} cm</span>
              </div>
            )}
          </div>

          {/* Interactive Mascot Highlight Card */}
          <div className="shrink-0 w-full md:w-auto flex justify-center">
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/20 shadow-xl flex items-center gap-3">
              <NutriDeMascot
                size="lg"
                showGreeting={true}
                childName={activeChild?.name.split(' ')[0]}
                isGtm={isGtmMode}
                className="max-w-xs sm:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Source & Live Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Context (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm space-y-4">
            {/* Mode Selector Tabs */}
            <div className="flex bg-amber-50/80 p-1 rounded-2xl border border-amber-200/60">
              <button
                onClick={() => {
                  setActiveMode('samples');
                  setCapturedImage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'samples' ? 'bg-white text-amber-800 shadow-xs' : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                <span>⭐ Contoh Cepat</span>
              </button>
              <button
                onClick={() => {
                  setActiveMode('camera');
                  setCapturedImage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'camera' ? 'bg-white text-amber-800 shadow-xs' : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Kamera</span>
              </button>
              <button
                onClick={() => {
                  setActiveMode('upload');
                  setCapturedImage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'upload' ? 'bg-white text-amber-800 shadow-xs' : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah</span>
              </button>
            </div>

            {/* Mode 1: Camera Viewfinder */}
            {activeMode === 'camera' && (
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-4/3 flex items-center justify-center border-2 border-dashed border-amber-300">
                {capturedImage ? (
                  <div className="relative w-full h-full">
                    <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setResult(null);
                        startCamera();
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Foto Ulang
                    </button>
                  </div>
                ) : cameraError ? (
                  <div className="p-4 text-center text-red-200 text-xs">
                    <AlertTriangle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                    <p>{cameraError}</p>
                    <button
                      onClick={() => setActiveMode('upload')}
                      className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                    >
                      Gunakan Unggah Foto
                    </button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Viewfinder frame overlay */}
                    <div className="absolute inset-4 border-2 border-dashed border-amber-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                      <div className="bg-black/40 text-white text-[11px] px-3 py-1 rounded-full backdrop-blur-xs">
                        Arahkan kamera ke piring makanan
                      </div>
                    </div>
                    {/* Camera Controls */}
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
                        }
                        className="p-2.5 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all"
                        title="Balik Kamera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCapturePhoto}
                        className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-90 border-4 border-white shadow-lg flex items-center justify-center text-white transition-all"
                        title="Ambil Foto"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mode 2: Upload File */}
            {activeMode === 'upload' && (
              <div className="space-y-3">
                {capturedImage ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 border-2 border-amber-200">
                    <img src={capturedImage} alt="Uploaded food" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setResult(null);
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="food-upload-input"
                    className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl aspect-4/3 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Klik untuk unggah atau seret foto makanan</span>
                    <span className="text-[11px] text-gray-500 mt-1">Mendukung format JPG, PNG, WEBP</span>
                    <input
                      id="food-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Mode 3: Presets Samples Grid */}
            {activeMode === 'samples' && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-gray-500">
                  Pilih salah satu menu bergizi anak di bawah ini untuk mencoba sistem langsung:
                </p>
                <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {SAMPLE_FOODS.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        capturedImage === sample.imageUrl
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                          : 'bg-white border-gray-100 hover:border-amber-200 hover:bg-amber-50/40'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 truncate">{sample.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${sample.badgeColor}`}>
                            {sample.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{sample.description}</p>
                        <div className="text-[10px] font-medium text-amber-700 mt-0.5 flex items-center gap-1">
                          <span>{sample.estimatedPortion}</span>
                          {sample.isAnimalProteinSuperfood && (
                            <span className="text-emerald-700 font-bold">• Protein Hewani ⭐</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Context Parameters */}
            <div className="pt-2 border-t border-amber-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Waktu / Jadwal Makan:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(Object.keys(mealTypeLabels) as MealType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedMealType(type)}
                      className={`p-1.5 rounded-xl text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5 border ${
                        selectedMealType === type
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span>{mealTypeLabels[type].icon}</span>
                      <span className="truncate w-full">{mealTypeLabels[type].label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* GTM Mode Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🥣</span>
                  <div>
                    <span className="text-xs font-bold text-rose-900 block leading-tight">
                      Fase GTM / Picky Eater?
                    </span>
                    <span className="text-[10px] text-rose-700">
                      NutriDe akan otomatis menyertakan tips kreasi penyajian agar anak lahap
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isGtmMode}
                  onChange={(e) => setIsGtmMode(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded-md border-rose-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Action Button: Run AI Analysis */}
              <button
                onClick={handleRunAnalysis}
                disabled={!capturedImage || isAnalyzing}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                  !capturedImage || isAnalyzing
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 active:scale-[0.99] text-white shadow-amber-300'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>NutriDe Sedang Menganalisis Porsi & Gizi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analisis Makanan dengan Maskot AI NutriDe</span>
                  </>
                )}
              </button>

              {analysisError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{analysisError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: NutriDe Output Hub (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden flex flex-col h-full">
              {/* Header with Dual-Format Tabs & Audio Trigger */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 p-4 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-300 shadow-xs shrink-0 bg-amber-100">
                    <img src={mascotImg} alt="NutriDe" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-tight">
                      Hasil Analisis Maskot AI NutriDe
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-700">
                      Porsi Estimasi: {result.dataJson?.estimated_portion || '1 porsi anak'}
                    </p>
                  </div>
                </div>

                {/* Tabs & Speech */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSpeech}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSpeaking
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-white hover:bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                    title="Dengarkan Suara NutriDe"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Hentikan' : 'Suara NutriDe'}</span>
                  </button>

                  <div className="bg-white rounded-xl p-0.5 border border-amber-200 flex">
                    <button
                      onClick={() => setActiveResultTab('interactive')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeResultTab === 'interactive'
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-600 hover:text-amber-700'
                      }`}
                    >
                      Pesan Ceria
                    </button>
                    <button
                      onClick={() => setActiveResultTab('json')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeResultTab === 'json'
                          ? 'bg-amber-500 text-white'
                          : 'text-gray-600 hover:text-amber-700'
                      }`}
                    >
                      Data JSON
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab 1: Interactive View */}
              {activeResultTab === 'interactive' && (
                <div className="p-5 sm:p-6 space-y-5 flex-1">
                  {/* Stunting Prevention Badge */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                          Skor Pencegahan Stunting:
                        </div>
                        <div className="text-sm font-black text-emerald-900">
                          {result.dataJson?.stunting_prevention_score || 'Tinggi'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-200/80 text-emerald-900 rounded-full">
                      Kemenkes Certified Logic
                    </span>
                  </div>

                  {/* Interactive Message Content formatted */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-gray-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {result.interactiveMessage}
                  </div>

                  {/* Quick Macronutrient Snapshot */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Kandungan Makronutrisi Terdeteksi
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-center">
                        <span className="text-[11px] text-amber-800 font-semibold block">Energi</span>
                        <span className="text-base font-black text-amber-950">
                          {result.dataJson?.nutritional_facts?.calories_kcal || 0}
                        </span>
                        <span className="text-[10px] text-amber-700 block">kkal</span>
                      </div>
                      <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200 text-center">
                        <span className="text-[11px] text-rose-800 font-semibold block">Protein</span>
                        <span className="text-base font-black text-rose-950">
                          {result.dataJson?.nutritional_facts?.protein_g || 0}
                        </span>
                        <span className="text-[10px] text-rose-700 block">gram</span>
                      </div>
                      <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-200 text-center">
                        <span className="text-[11px] text-blue-800 font-semibold block">Karbo</span>
                        <span className="text-base font-black text-blue-950">
                          {result.dataJson?.nutritional_facts?.carbohydrates_g || 0}
                        </span>
                        <span className="text-[10px] text-blue-700 block">gram</span>
                      </div>
                      <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-center">
                        <span className="text-[11px] text-amber-800 font-semibold block">Lemak</span>
                        <span className="text-base font-black text-amber-950">
                          {result.dataJson?.nutritional_facts?.fat_g || 0}
                        </span>
                        <span className="text-[10px] text-amber-700 block">gram</span>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 text-center col-span-2 sm:col-span-1">
                        <span className="text-[11px] text-emerald-800 font-semibold block">Serat</span>
                        <span className="text-base font-black text-emerald-950">
                          {result.dataJson?.nutritional_facts?.fiber_g || 0}
                        </span>
                        <span className="text-[10px] text-emerald-700 block">gram</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Micronutrients */}
                  {result.dataJson?.key_micronutrients?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Mikronutrisi Kunci Tumbuh Kembang
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.dataJson.key_micronutrients.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                          >
                            <span className="font-bold text-gray-900">{item.nutrient}:</span>
                            <span className="font-bold text-amber-600">{item.amount}</span>
                            <span className="text-[11px] text-gray-500">({item.benefit_category})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Structured JSON Data */}
              {activeResultTab === 'json' && (
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">
                      Format JSON Terstruktur untuk Database & API Agregasi:
                    </span>
                    <button
                      onClick={handleCopyJson}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-all"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Tersalin!' : 'Salin JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-[350px] leading-relaxed border border-gray-800 shadow-inner">
                    {JSON.stringify(result.dataJson, null, 2)}
                  </pre>
                  <p className="text-[11px] text-gray-500">
                    💡 JSON ini dapat langsung disimpan ke database harian (PostgreSQL / SQLite / Firestore) untuk agregasi progress bar gizi dan grafik tumbuh kembang anak.
                  </p>
                </div>
              )}

              {/* Footer Save Action Bar */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  {isSaved ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tersimpan ke catatan harian {activeChild?.name}!
                    </span>
                  ) : (
                    <span>Klik tombol di kanan untuk menyimpan makanan ini ke grafik harian.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isSaved ? (
                    <button
                      onClick={onGoToDashboard}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Lihat Dashboard Gizi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveToDailyLog}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-200 active:scale-95"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Simpan ke Log Harian Si Kecil</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="h-full min-h-[350px] rounded-3xl border-2 border-dashed border-amber-200/80 bg-amber-50/20 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mb-4 shadow-sm animate-pulse">
                📸
              </div>
              <h3 className="text-base font-bold text-gray-800">
                Pilih atau Ambil Foto Makanan Terlebih Dahulu
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm">
                Gunakan kamera ponsel/laptop, unggah gambar piring makan, atau klik tab &quot;⭐ Contoh Cepat&quot; di kolom sebelah kiri untuk menguji analisis gizi secara instan.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-amber-800">
                <span className="px-3 py-1 bg-white rounded-full border border-amber-200 shadow-xs">
                  ✅ Porsi Standar Anak
                </span>
                <span className="px-3 py-1 bg-white rounded-full border border-amber-200 shadow-xs">
                  ✅ Zat Besi & Seng (Zinc)
                </span>
                <span className="px-3 py-1 bg-white rounded-full border border-amber-200 shadow-xs">
                  ✅ Skor Anti-Stunting
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
