import OpenAI from 'openai';
import { env } from '@/lib/env';
import type { FAQEntry } from '@/types/models';

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export interface FaqMatchResult {
  confidence: number;
  answer: string | null;
  faqId: string | null;
}

export async function matchFaq(question: string, faqEntries: FAQEntry[]): Promise<FaqMatchResult> {
  if (!faqEntries.length) return { confidence: 0, answer: null, faqId: null };
  if (!client) return fallbackFaqMatch(question, faqEntries);

  const serialized = faqEntries.map((f) => ({ id: f.id, q: f.question, a: f.approved_answer }));

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a strict FAQ selector. Return JSON: {"faqId":string|null,"confidence":number}. Select only from listed IDs.' },
      { role: 'user', content: `Question: ${question}\nFAQ: ${JSON.stringify(serialized)}` }
    ]
  });

  const json = JSON.parse(completion.choices[0].message.content || '{}');
  const picked = faqEntries.find((f) => f.id === json.faqId) || null;

  return {
    confidence: typeof json.confidence === 'number' ? json.confidence : 0,
    faqId: picked?.id ?? null,
    answer: picked?.approved_answer ?? null
  };
}

export function fallbackFaqMatch(question: string, faqEntries: FAQEntry[]): FaqMatchResult {
  const terms = question.toLowerCase().split(/\W+/).filter(Boolean);
  let best: FAQEntry | null = null;
  let score = 0;

  for (const entry of faqEntries) {
    const hay = `${entry.question} ${entry.approved_answer} ${entry.tags ?? ''}`.toLowerCase();
    const entryScore = terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0) / Math.max(terms.length, 1);
    if (entryScore > score) {
      score = entryScore;
      best = entry;
    }
  }

  return { confidence: score, faqId: best?.id ?? null, answer: best?.approved_answer ?? null };
}

export function parseFaqSelectorResponse(raw: string): { faqId: string | null; confidence: number } {
  const parsed = JSON.parse(raw);
  return {
    faqId: typeof parsed.faqId === 'string' ? parsed.faqId : null,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0
  };
}
