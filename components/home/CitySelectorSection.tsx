'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

const CITIES = [
  {
    nameKey: 'home.city_selector.cities.barcelona',
    slug: 'barcelona',
    image: '/images/barcelona-city.jpg',
    descriptionKey: 'home.city_selector.cities.barcelona_desc',
  },
  {
    nameKey: 'home.city_selector.cities.madrid',
    slug: 'madrid',
    image: '/images/madrid-city.jpg',
    descriptionKey: 'home.city_selector.cities.madrid_desc',
  },
  {
    nameKey: 'home.city_selector.cities.valencia',
    slug: 'valencia',
    image: '/images/valencia-city.jpg',
    descriptionKey: 'home.city_selector.cities.valencia_desc',
  },
];

export default function CitySelectorSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home.city_selector.title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('home.city_selector.subtitle')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CITIES.map((city) => (
            <Link key={city.slug} href={`/${language}/spain/${city.slug}`} className="group relative block overflow-hidden rounded-xl aspect-[4/3]">
              <div className="absolute inset-0 bg-muted animate-pulse group-hover:hidden transition-opacity duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 z-10" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                <h3 className="text-2xl font-bold text-white mb-1">{t(city.nameKey)}</h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">{t(city.descriptionKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
