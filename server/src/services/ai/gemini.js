import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { AiUnavailableError } from '../../utils/apiError.js';

function createClient() {
  if (!env.AI_API_KEY) {
    return null;
  }

  return new GoogleGenAI({
    apiKey: env.AI_API_KEY,
  });
}

function getErrorStatus(error) {
  return (
    error?.status ??
    error?.code ??
    error?.response?.status ??
    error?.error?.code
  );
}

async function generateWithRetry(ai, prompt) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await ai.models.generateContent({
        model: env.AI_MODEL,
        contents: prompt,
        config: {
          maxOutputTokens: 900,
        },
      });
    } catch (error) {
      const status = getErrorStatus(error);

      const retryable =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504;

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.warn(
        `[AI] Gemini request failed (${status}). Retrying in ${delay}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Gemini request failed');
}

export async function analyzeDebugSession(investigation) {
  const ai = createClient();

  if (!ai) {
    throw new AiUnavailableError(
      'AI analysis is unavailable because AI_API_KEY is not configured.',
    );
  }

  const prompt = `
You are the AI debugging analyst inside DevTrace.

DevTrace is a debugging journal where developers record:
Problem → Hypothesis → Experiment → Evidence → Root Cause → Solution → Lesson.

Your job is to analyze ONLY the debugging investigation data provided below.

STRICT RULES:
- Do not invent facts.
- Do not assume information that is not present.
- Do not diagnose anything that the data does not support.
- If information is missing, explicitly say that it is unavailable.
- Base every conclusion on the recorded session, hypotheses and experiments.
- Do not make up experiment results.
- Do not make up causes or solutions.
- Be concise and useful to a software developer.

Return Markdown using exactly these sections:

## Investigation Summary
Summarize the debugging problem and final state.

## Experiment Sequence
Explain how the hypotheses and experiments progressed.

## Debugging Efficiency
Discuss the investigation efficiency using only available evidence.
Mention things such as number of hypotheses, rejected hypotheses,
confirmed hypotheses and experiments when available.

## Repeated Patterns
Identify recurring debugging patterns only if they are supported by
the recorded investigation.

## Lessons
Extract practical lessons from the recorded investigation.
Do not invent lessons that are not supported by the data.

INVESTIGATION DATA:

${JSON.stringify(investigation, null, 2)}
`;

  try {
    const response = await generateWithRetry(ai, prompt);

    const analysis = response?.text?.trim();

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

    const status = getErrorStatus(error);

    console.error('[AI] Gemini request failed:', {
      status,
      message: error?.message,
    });

    if (status === 401 || status === 403) {
      throw new AiUnavailableError(
        'AI analysis is unavailable because the Gemini API key is invalid or does not have access.',
      );
    }

    if (status === 404) {
      throw new AiUnavailableError(
        `AI model "${env.AI_MODEL}" is unavailable. Check the configured Gemini model.`,
      );
    }

    if (status === 429) {
      throw new AiUnavailableError(
        'AI analysis is temporarily rate-limited. Please try again shortly.',
      );
    }

    if (
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504
    ) {
      throw new AiUnavailableError(
        'Gemini is temporarily unavailable. Please try again shortly.',
      );
    }

    throw new AiUnavailableError(
      'AI analysis is currently unavailable. Please try again later.',
    );
  }
}