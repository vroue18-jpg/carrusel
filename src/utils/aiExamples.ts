import Anthropic from '@anthropic-ai/sdk';
import type { PhrasalVerb } from '../data/particles';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

export async function generateExamples(phrasalVerbs: PhrasalVerb[]): Promise<Record<string, string>> {
  const verbList = phrasalVerbs.map((pv) => `${pv.verb} (${pv.meaning})`).join('\n');

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: `Create one fresh, natural, modern example sentence for each of these English phrasal verbs.
Make them vivid, relatable, and slightly different in context from typical textbook examples.
Use everyday situations: social media, travel, food, work, relationships.

Phrasal verbs:
${verbList}

Respond ONLY with a JSON object like:
{"give up": "...", "speed up": "...", ...}
No extra text.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
