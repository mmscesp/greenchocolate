'use client';

import { Search, Filter } from '@/lib/icons';
import Link from 'next/link';

interface Category {
  name: string;
  count: number;
}

interface BlogFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  currentLang: string;
}

export default function BlogFilters({
  categories,
  currentCategory,
  currentSearch = '',
  currentLang,
}: BlogFiltersProps) {
  return (
    <div className="bg-card rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <form action={`/${currentLang}/editorial`} method="GET" className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="search"
            placeholder="Search articles..."
            defaultValue={currentSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
          {/* Preserve category when searching if desired, but following original behavior for now */}
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <form action={`/${currentLang}/editorial`} method="GET">
            <select
              name="category"
              defaultValue={currentCategory || ''}
              onChange={(e) => e.target.form?.submit()}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Link
          href={`/${currentLang}/editorial`}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            !currentCategory
              ? 'bg-green-100 border-green-300 text-green-800'
              : 'bg-muted border-gray-200 text-gray-700 hover:bg-muted/80'
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/${currentLang}/editorial?category=${encodeURIComponent(cat.name)}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              currentCategory === cat.name
                ? 'bg-green-100 border-green-300 text-green-800'
                : 'bg-muted border-gray-200 text-gray-700 hover:bg-muted/80'
            }`}
          >
            {cat.name} ({cat.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
