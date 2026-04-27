import { render, screen, within } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import HeroSection from '@/components/HeroSection';

const mocks = vi.hoisted(() => ({
  useLanguage: vi.fn(),
  trackEvent: vi.fn(),
}));

vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: mocks.useLanguage,
}));

vi.mock('@/lib/analytics', () => ({
  trackEvent: mocks.trackEvent,
}));

vi.mock('gsap', () => {
  const gsapApi = {
    registerPlugin: vi.fn(),
    matchMedia: () => ({
      add: vi.fn(),
      revert: vi.fn(),
    }),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn() })),
    utils: {
      toArray: vi.fn(() => []),
    },
  };

  return { default: gsapApi };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

describe('HeroSection CTA responsiveness', () => {
  beforeAll(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('min-width'),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  it('uses a wrap-enabled desktop CTA group and removes nowrap pressure on CTA links', () => {
    mocks.useLanguage.mockReturnValue({
      language: 'fr',
      t: (key: string) => {
        if (key === 'hero.section.cta_primary') return 'Obtenir le Safety Kit gratuit maintenant';
        if (key === 'hero.section.cta_secondary') return 'Comment les clubs fonctionnent vraiment en Espagne';
        if (key === 'hero.section.scroll_hint') return 'Scroll';
        if (key === 'hero.section.body') return 'Body';
        if (key === 'hero.section.headline.line_1') return 'Headline one';
        if (key === 'hero.section.headline.line_2') return 'Headline two';
        if (key === 'hero.section.headline.line_3') return 'Headline three';
        if (key === 'hero.section.pill_label') return 'Label';
        if (key === 'hero.section.pill_value') return 'Value';
        return key;
      },
    });

    render(<HeroSection />);

    const ctaGroup = screen.getByTestId('hero-desktop-cta-group');
    const primaryCta = within(ctaGroup).getByRole('link', { name: 'Obtenir le Safety Kit gratuit maintenant' });
    const secondaryCta = within(ctaGroup).getByRole('link', { name: 'Comment les clubs fonctionnent vraiment en Espagne' });

    expect(ctaGroup).toHaveClass('flex-wrap');
    expect(primaryCta).toHaveClass('!whitespace-normal');
    expect(primaryCta).toHaveClass('!overflow-visible');
    expect(secondaryCta).toHaveClass('!whitespace-normal');
  });
});
