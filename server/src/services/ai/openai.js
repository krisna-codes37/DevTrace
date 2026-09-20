import { env } from '../../config/env.js';
import { AiUnavailableError } from '../../utils/apiError.js';

const responsesUrl = 'https://api.openai.com/v1/responses';

function outputText(response) {
  if (response.output_text) return response.output_text.trim();

  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text)
    .join('\n')
    .trim();
}

export async function analyzeDebugSession(investigation) {
  if (!env.AI_API_KEY) {
    throw new AiUnavailableError('AI analysis is unavailable because AI_API_KEY is not configured.');
  }

  let providerResponse;
  try {
    providerResponse = await fetch(responsesUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        store: false,
        max_output_tokens: 700,
        instructions: [
          'You analyze a debugging investigation.',
          'Base every statement strictly on the supplied investigation data.',
          'Do not infer, assume, or invent missing facts. Explicitly say when data is unavailable.',
          'Return concise Markdown with these headings: Investigation summary, Experiment sequence, Debugging efficiency, Repeated patterns, Lessons.',
          'Address hypothesis counts, rejected hypotheses, confirmed hypotheses, experiment order, efficiency, patterns, and lessons only when supported by the data.',
        ].join(' '),
        input: JSON.stringify(investigation),
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new AiUnavailableError('AI analysis could not be reached. Please try again later.');
  }

  if (!providerResponse.ok) {
    throw new AiUnavailableError('AI analysis is currently unavailable. Please try again later.');
  }

  const providerData = await providerResponse.json();
  const analysis = outputText(providerData);

  if (!analysis) {
    throw new AiUnavailableError('AI analysis did not return a usable result. Please try again later.');
  }

  return analysis;
}
