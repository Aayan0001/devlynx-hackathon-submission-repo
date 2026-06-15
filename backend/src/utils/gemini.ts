import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';

let genAI: GoogleGenerativeAI | null = null;

if (config.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    console.log('Gemini Generative AI client initialized.');
  } catch (error) {
    console.error('Failed to initialize Gemini Generative AI client:', error);
  }
}

/**
 * Sends a structured prompt to Gemini with system instructions, requesting JSON output.
 */
export async function askGeminiJson<T>(systemInstruction: string, prompt: string): Promise<T | null> {
  if (!genAI) {
    console.warn('Gemini API client not initialized. Skipping API call.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      },
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse response as JSON
    return JSON.parse(text.trim()) as T;
  } catch (error) {
    console.error('Error during Gemini API execution:', error);
    return null;
  }
}
