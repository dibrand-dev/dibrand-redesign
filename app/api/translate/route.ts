import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Standard Server-Side protection: API Key is only used here
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, targetLang, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY is not defined');
      return NextResponse.json({ error: 'Translation service not configured (Missing API Key)' }, { status: 500 });
    }

    console.log(`Translating text (len: ${text.length}) to ${targetLang} with context: ${context || 'default'}.`);

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Determine the system prompt based on context
    let systemInstruction = `Sos un experto traductor de ingeniería de software para una boutique de tecnología de clase mundial. Traducí del español al inglés americano. No busqués una traducción literal; refiná el estilo para que suene aspiracional, profesional y senior. Usá terminología precisa como 'Staff Augmentation', 'Roadmap', 'Scalability' y 'Impact-driven development'. MANTENÉ CUALQUIER ETIQUETA HTML O FORMATO ORIGINAL. El resultado debe estar a la altura de agencias como Rootstrap o Thoughtbot. Retorná ÚNICAMENTE el texto traducido, sin explicaciones ni comillas.`;
    
    if (context === 'hr') {
        systemInstruction = `Actúa como un reclutador tech senior. Traduce la descripción del puesto al inglés manteniendo un tono profesional, atractivo y claro. Usa terminología de la industria (ej. 'Remote-first', 'Perks', 'Technical Stack'). MANTENÉ ESTRICTAMENTE CUALQUIER ETIQUETA HTML (como <p>, <ul>, <li>, <strong>, <h2>, etc.) O FORMATO ORIGINAL; no las traduzcas ni las elimines. No busques una traducción literal; refina el estilo para atraer talento de clase mundial. Retorná ÚNICAMENTE el texto traducido, sin explicaciones ni comillas.`;
    }

    const modelsToTry = [
        "gemini-2.0-flash-lite", 
        "gemini-2.5-flash-lite", 
        "gemini-2.0-flash", 
        "gemini-2.5-flash"
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[TRANSLATE] Attempting with: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `System Instruction: ${systemInstruction}
            
            Traducí el siguiente texto al ${targetLang === 'en' ? 'Inglés Americano' : 'Español'}: \n\n${text}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return NextResponse.json({ translatedText: response.text().trim() });
        } catch (error: any) {
            console.warn(`[TRANSLATE] Model ${modelName} failed:`, error.message);
            lastError = error;
            
            // If it's a 404, we continue to next model
            // If it's a 429 (Quota), we might want to stop, but let's try others just in case one has separate quota
        }
    }

    // EXTRA: If all failed, let's try to list models to console to debug
    try {
        console.log('[TRANSLATE] Emergency model discovery initiated...');
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        const data = await resp.json();
        if (data.models) {
            console.log('[TRANSLATE] Available models in your account:', data.models.map((m: any) => m.name).join(', '));
        }
    } catch (e) {
        console.error('[TRANSLATE] Could not even list models:', e);
    }

    throw lastError || new Error("All models failed");
  } catch (error: any) {
    console.error('Gemini Translation error:', error);
    return NextResponse.json({ 
      error: `Error de IA: ${error.message || 'Error desconocido'}`,
      details: error
    }, { status: 500 });
  }
}
