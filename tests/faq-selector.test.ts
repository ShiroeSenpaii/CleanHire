import { describe, expect, it } from 'vitest';
import { fallbackFaqMatch, parseFaqSelectorResponse } from '@/lib/faq/matcher';

describe('faq selector parsing', () => {
  it('parses selector response schema safely', () => {
    expect(parseFaqSelectorResponse('{"faqId":"faq_1","confidence":0.78}')).toEqual({ faqId: 'faq_1', confidence: 0.78 });
    expect(parseFaqSelectorResponse('{"foo":"bar"}')).toEqual({ faqId: null, confidence: 0 });
  });

  it('fallback matcher returns best faq answer', () => {
    const result = fallbackFaqMatch('where do i clock in', [
      { id: '1', companyId: 'c1', question: 'Where do I clock in?', answer: 'Use app check-in.', tags: 'clock', active: true },
      { id: '2', companyId: 'c1', question: 'Uniform', answer: 'Wear black pants.', tags: '', active: true }
    ]);

    expect(result.faqId).toBe('1');
    expect(result.answer).toBe('Use app check-in.');
  });
});
