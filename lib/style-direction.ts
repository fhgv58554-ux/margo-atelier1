import { GoogleGenAI } from '@google/genai';

export function generateInternalCoutureDirection(params: {
  occasion?: string;
  silhouette?: string;
  style?: string;
  colors?: string[];
  measurements?: any;
  priorities?: string[];
  referenceNotes?: string;
}) {
  const { silhouette } = params;
  const silLabel = silhouette || 'Architectural Column Silhouette';
  return {
    headline: `Architectural Serenity in Pure Silk: ${silLabel}`,
    concept: `A bespoke sartorial study harmonizing contemporary architectural lines with fluid Mediterranean grace. Designed with understated elegance, prioritizing tactile luxury and precise silhouette contouring.`,
    recommendedFabrics: [
      'Heavyweight Italian Silk Crêpe (Lake Como)',
      'Double-faced Duchess Silk Satin with subtle matte luster',
      'Airy Silk Muslin and Organza for fluid drapery accents',
      'Pure Silk Habotai interior lining for effortless skin comfort',
    ],
    architecturalDetails: [
      'Concealed internal cotton grosgrain waiststay for graceful posture support',
      'Bias-cut architectural drape contouring the natural feminine silhouette',
      'Hand-rolled invisible hems with delicate couture hand-stitching',
    ],
    consultationFocus: [
      'Tactile silk swatch drape review under natural atelier daylight',
      'Cotton toile prototype construction calibrated to your measurements',
      'Proportion and hem calibration tailored to your footwear and event setting',
    ],
  };
}

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export async function createStyleDirection(body: any) {
  const {
    occasion,
    timeline,
    date,
    budget,
    silhouette,
    style,
    colors,
    measurements,
    priorities,
    referenceNotes,
  } = body || {};

  const fallback = () =>
    generateInternalCoutureDirection({
      occasion,
      silhouette,
      style,
      colors,
      measurements,
      priorities,
      referenceNotes,
    });

  const ai = getGeminiClient();
  if (!ai) {
    return fallback();
  }

  const prompt = `You are the Head Creative Director and Haute Couture Stylist of MARGO ATELIER (inspired by contemporary high-fashion atelier start.margocreativelab.com: quiet luxury, contemporary couture, feminine, Mediterranean warm natural light, ivory/cream/nude/sand tones, architectural silhouettes, pure fabrics, no generic bridal clichés).

Language: English. High-fashion luxury couture tone.

Generate a personalized, evocative, and high-fashion "AI Style Direction" for an upcoming atelier consultation based on this client's profile:
- Occasion: ${occasion || 'Custom Atelier Creation'}
- Event Date / Timeline: ${date ? date + ' (' + timeline + ')' : timeline || 'Flexible'}
- Investment Budget: ${budget || 'Atelier Bespoke'}
- Preferred Silhouette: ${silhouette || 'Fluid Architectural'}
- Style Essence: ${style || 'Quiet Luxury Editorial'}
- Color Palette: ${Array.isArray(colors) ? colors.join(', ') : colors || 'Ivory, Nude, Sand'}
- Fit & Silhouette Details: ${
  Array.isArray(measurements?.fitPreferences) && measurements.fitPreferences.length > 0
    ? measurements.fitPreferences.join(', ')
    : measurements?.fitPreference || 'Tailored to posture'
}, Size/Height: ${measurements?.clothingSize || measurements?.size || 'Bespoke'} / ${measurements?.height || 'Custom'}
- Client Notes: ${measurements?.notes || 'None'}
- Client Priorities: ${Array.isArray(priorities) ? priorities.join(', ') : priorities || 'Fabric quality & architectural silhouette'}
- Visual Reference Notes: ${referenceNotes || 'Editorial couture minimalism'}

Respond in clean, valid JSON format ONLY with this exact JSON structure:
{
  "headline": "A poetic, evocative 4-7 word title capturing the aesthetic identity",
  "concept": "A 2-3 sentence editorial fashion narrative describing the mood, movement, and silhouette in quiet luxury couture terminology.",
  "recommendedFabrics": ["3 to 4 specific luxury haute couture fabrics with origin and texture, e.g., Heavyweight Como silk crêpe, double-faced duchess satin, crêpe de chine"],
  "architecturalDetails": ["3 specific cut, structural, and drapery highlights crafted for this client"],
  "consultationFocus": ["3 specific discussion points and tactile draping tests the Master Couturier will prepare for the client's first consultation"]
}`;

  const systemInstruction =
    'You are the Master Couturier of MARGO Atelier. Your tone is warm, confident, deeply knowledgeable in contemporary luxury fashion, refined, and editorial. Never sound robotic or generic.';

  try {
    const generateWithTimeout = Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Internal generation timeout, using local couture engine')), 4500)
      ),
    ]);

    const response = await generateWithTimeout;
    const responseText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!parsed) {
      throw new Error('Failed to parse style direction response');
    }

    return parsed;
  } catch (error: any) {
    console.info('[MARGO Internal Engine] Using internal couture direction synthesizer:', error?.message || error);
    return fallback();
  }
}
