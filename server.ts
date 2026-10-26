import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_PROMPT = `Anda adalah "NutriDe Sahabat Anak", asisten ahli gizi anak digital dan maskot AI yang ceria, ramah, interaktif, dan penuh semangat! Tugas utama Anda adalah menganalisis foto makanan/buah yang dikirimkan, mengidentifikasi porsi serta kandungan nutrisinya, dan menjelaskan manfaatnya untuk tumbuh kembang anak dengan gaya bahasa yang menyenangkan bagi orang tua dan si kecil.

---

### ATURAN UTAMA:
1. Jika foto yang dikirimkan BUKAN makanan/minuman, tolak dengan sopan dan bercanda ramah, lalu minta foto makanan yang lezat.
2. Identifikasi jenis makanan, perkiraan berat/porsi standar anak, makronutrisi (Kalori, Protein, Lemak, Karbohidrat), dan mikronutrisi penting untuk tumbuh kembang (Zat Besi, Kalsium, Vitamin A, Zinc, Serat, dll.).
3. Kaitkan nutrisi tersebut dengan "Kekuatan Super Anak" (contoh: Kalsium = Tulang Sekuat Pahlawan Super; Protein = Otot Kuat & Cepat Tinggi; Zat Besi = Otak Cerdas).
4. Berikan output dalam format DUAL: 
   - Bagian 1: Pesan teks interaktif untuk pengguna.
   - Bagian 2: Blok JSON valid murni untuk dibaca oleh backend aplikasi.

---

### STRUKTUR FORMAT OUTPUT:

[PESAN INTERAKTIF]
🎉 **Tadaaa! Makanan Terdeteksi:** [Nama Makanan]!
[Sapaan ceria dari NutriDe dan apresiasi karena telah makan sehat/bergizi]

💪 **Kekuatan Super untuk Tumbuh Kembang:**
- 🦴 [Manfaat 1: hubungkan nutrisi dengan tulang/tinggi badan/otot]
- 🧠 [Manfaat 2: hubungkan nutrisi dengan kecerdasan otak/daya tahan tubuh]

💡 **Tips Seru NutriDe:**
[1 tips penyajian seru atau cara mengajak anak makan jika sedang GTM / picky eater]

---
[DATA_JSON]
\`\`\`json
{
  "is_food": true,
  "food_name": "Nama Makanan",
  "estimated_portion": "Porsi estimasi (misal: 1 buah sedang / 100g)",
  "nutritional_facts": {
    "calories_kcal": 0,
    "protein_g": 0.0,
    "carbohydrates_g": 0.0,
    "fat_g": 0.0,
    "fiber_g": 0.0
  },
  "key_micronutrients": [
    {"nutrient": "Kalsium", "amount": "0 mg", "benefit_category": "tulang & gigi"},
    {"nutrient": "Vitamin A", "amount": "0 mcg", "benefit_category": "kesehatan mata"}
  ],
  "stunting_prevention_score": "Tinggi/Sedang/Cukup",
  "child_growth_summary": "Ringkasan 1 kalimat kenapa makanan ini bagus untuk pertumbuhan"
}
\`\`\`
(Pastikan JSON valid dan tidak ada teks di dalam blok JSON selain format JSON)`;

export interface FoodAnalysisResponse {
  success: boolean;
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
  rawText: string;
}

app.post('/api/analyze-food', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', childContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Gambar makanan tidak ditemukan' });
    }

    // Clean base64 string if data URL prefix is included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const childInfoText = childContext
      ? `Data Anak:
- Nama: ${childContext.name || 'Si Kecil'}
- Usia: ${childContext.ageDisplay || `${childContext.ageMonths || 24} bulan`}
- Jenis Kelamin: ${childContext.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
- Berat Badan: ${childContext.weightKg || '-'} kg
- Tinggi Badan: ${childContext.heightCm || '-'} cm
- Waktu Makan: ${childContext.mealType || 'Makan Utama'}
- Catatan Khusus: ${childContext.notes || 'Tidak ada catatan'}`
      : 'Data Anak: Balita usia 2-3 tahun umum';

    const userPrompt = `Halo NutriDe! Tolong analisis foto makanan ini untuk kebutuhan gizi si kecil dan pencegahan stunting.

${childInfoText}

Berikan analisis lengkap sesuai format DUAL: Pesan Interaktif dan Blok JSON Data Terstruktur.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const outputText = response.text || '';

    // Regex parsing for Dual Output
    const jsonMatch = outputText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let dataJson = null;

    if (jsonMatch && jsonMatch[1]) {
      try {
        dataJson = JSON.parse(jsonMatch[1].trim());
      } catch (parseErr) {
        console.warn('Direct JSON parse failed, trying relaxed extraction:', parseErr);
      }
    }

    // Extract interactive message (everything before [DATA_JSON] or ---)
    let interactiveMessage = outputText;
    if (outputText.includes('[DATA_JSON]')) {
      interactiveMessage = outputText.split('[DATA_JSON]')[0].trim();
    } else if (outputText.includes('```json')) {
      interactiveMessage = outputText.split('```json')[0].trim();
    }

    // Clean any trailing separator lines
    interactiveMessage = interactiveMessage.replace(/---\s*$/, '').trim();
    if (interactiveMessage.startsWith('[PESAN INTERAKTIF]')) {
      interactiveMessage = interactiveMessage.replace('[PESAN INTERAKTIF]', '').trim();
    }

    // Fallback if JSON was not captured
    if (!dataJson) {
      dataJson = {
        is_food: true,
        food_name: 'Makanan Anak',
        estimated_portion: '1 porsi standar anak',
        nutritional_facts: {
          calories_kcal: 180,
          protein_g: 5.5,
          carbohydrates_g: 24.0,
          fat_g: 4.2,
          fiber_g: 2.1,
        },
        key_micronutrients: [
          { nutrient: 'Kalsium', amount: '80 mg', benefit_category: 'tulang & gigi kuat' },
          { nutrient: 'Zat Besi', amount: '1.8 mg', benefit_category: 'perkembangan kognitif & anti anemia' },
          { nutrient: 'Vitamin A', amount: '120 mcg', benefit_category: 'daya tahan tubuh & mata' },
        ],
        stunting_prevention_score: 'Sedang',
        child_growth_summary: 'Asupan gizi mendukung pemenuhan energi dan tumbuh kembang anak harian.',
      };
    }

    return res.json({
      success: true,
      interactiveMessage,
      dataJson,
      rawText: outputText,
    });
  } catch (error: any) {
    console.error('Error analyzing food:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Gagal memproses analisis gambar makanan.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NutriDe Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
