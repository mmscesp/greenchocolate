import { describe, expect, it } from 'vitest';
import { normalizeArticleContent } from '@/lib/article-content';

describe('normalizeArticleContent', () => {
  it('splits inline separators and headings into standalone markdown blocks', () => {
    const source = 'The expectation gap is where scams happen. --- ### What This Means for Your Trip to Spain';

    expect(normalizeArticleContent(source)).toBe(
      'The expectation gap is where scams happen.\n\n---\n\n### What This Means for Your Trip to Spain'
    );
  });

  it('expands inline bullet runs into proper lists', () => {
    const source = 'Bring: - Valid ID - Membership confirmation - Cash (where needed)';

    expect(normalizeArticleContent(source)).toBe(
      'Bring:\n- Valid ID\n- Membership confirmation\n- Cash (where needed)'
    );
  });

  it('keeps multiple inline bullets on separate lines', () => {
    const source = '- No public consumption - No location sharing - No social posting of club details';

    expect(normalizeArticleContent(source)).toBe(
      '- No public consumption\n- No location sharing\n- No social posting of club details'
    );
  });
});
