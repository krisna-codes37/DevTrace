import { GoogleGenAI } from '@google/genai';

import { env } from '../../config/env.js';
import { AiUnavailableError } from '../../utils/apiError.js';

const ai = env.AI_API_KEY
  ? new GoogleGenAI({ apiKey: env.AI_API_KEY })
  : null;

export async function analyzeDebugSession(investigation) {
  if (!ai) {
    throw new AiUnavailableError(
      'AI analysis is unavailable because AI_API_KEY is not configured.',
    );
  }

  const prompt = [
    'You analyze a debugging investigation.',
    'Base every statement strictly on the supplied investigation data.',
    'Do not infer, assume, or invent missing facts.',
    'Explicitly say when data is unavailable.',
    'Return concise Markdown with these headings: Investigation summary, Experiment sequence, Debugging efficiency, Repeated patterns, Lessons.',
    'Address hypothesis counts, rejected hypotheses, confirmed hypotheses, experiment order, efficiency, patterns, and lessons only when supported by the data.',
    '',
    'Investigation data:',
    JSON.stringify(investigation, null, 2),
  ].join('\n');

  try {
    const response = await ai.models.generateContent({
      model: env.AI_MODEL,
      contents: prompt,
    });

    const analysis = response.text?.trim();

    if (!analysis) {
      throw new AiUnavailableError(
        'AI analysis did not return a usable result. Please try again later.',
      );
    }

    return analysis;
  } catch (error) {
    if (error instanceof AiUnavailableError) {
      throw error;
    }

    console.error('[AI] Gemini request failed:', error);

    throw new AiUnavailableError(
      'AI analysis is currently unavailable. Please try again later.',
    );
  }
}