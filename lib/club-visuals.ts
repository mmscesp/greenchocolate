const DISTRICT_FALLBACK_BASE = '/images/fallbacks/Districts';

const BARCELONA_NEIGHBORHOOD_COVERS: Record<string, string> = {
  'barceloneta': `${DISTRICT_FALLBACK_BASE}/Barceloneta.webp`,
  'eixample': `${DISTRICT_FALLBACK_BASE}/Eixample.webp`,
  'eixample-dreta': `${DISTRICT_FALLBACK_BASE}/Eixample.webp`,
  'dreta-de-l-eixample': `${DISTRICT_FALLBACK_BASE}/Eixample.webp`,
  'eixample-esquerra': `${DISTRICT_FALLBACK_BASE}/EixampleEsquerra.webp`,
  'l-antiga-esquerra-de-l-eixample': `${DISTRICT_FALLBACK_BASE}/EixampleEsquerra.webp`,
  'la-nova-esquerra-de-l-eixample': `${DISTRICT_FALLBACK_BASE}/EixampleEsquerra.webp`,
  'el-born': `${DISTRICT_FALLBACK_BASE}/ElBorn.webp`,
  'born': `${DISTRICT_FALLBACK_BASE}/ElBorn.webp`,
  'sant-pere': `${DISTRICT_FALLBACK_BASE}/ElBorn.webp`,
  'sant-pere-santa-caterina-i-la-ribera': `${DISTRICT_FALLBACK_BASE}/ElBorn.webp`,
  'el-raval': `${DISTRICT_FALLBACK_BASE}/ElRaval.webp`,
  'raval': `${DISTRICT_FALLBACK_BASE}/ElRaval.webp`,
  'gotic': `${DISTRICT_FALLBACK_BASE}/Gotic.webp`,
  'gothic': `${DISTRICT_FALLBACK_BASE}/Gotic.webp`,
  'barri-gotic': `${DISTRICT_FALLBACK_BASE}/Gotic.webp`,
  'les-corts': `${DISTRICT_FALLBACK_BASE}/LesCorts.webp`,
  'nou-barris': `${DISTRICT_FALLBACK_BASE}/NouBarris.webp`,
  'poblenou': `${DISTRICT_FALLBACK_BASE}/Poblenou.webp`,
  'el-poblenou': `${DISTRICT_FALLBACK_BASE}/Poblenou.webp`,
  'poble-sec': `${DISTRICT_FALLBACK_BASE}/PobleSec.webp`,
  'sant-antoni': `${DISTRICT_FALLBACK_BASE}/SantAntoni.webp`,
  'sant-gervasi': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
  'sant-gervasi-galvany': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
  'sarria': `${DISTRICT_FALLBACK_BASE}/Sarria.webp`,
  'sarria-sant-gervasi': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
};

const BARCELONA_DISTRICT_COVERS: Record<string, string> = {
  'ciutat-vella': `${DISTRICT_FALLBACK_BASE}/Gotic.webp`,
  'eixample': `${DISTRICT_FALLBACK_BASE}/Eixample.webp`,
  'les-corts': `${DISTRICT_FALLBACK_BASE}/LesCorts.webp`,
  'nou-barris': `${DISTRICT_FALLBACK_BASE}/NouBarris.webp`,
  'sant-marti': `${DISTRICT_FALLBACK_BASE}/Poblenou.webp`,
  'sants-montjuic': `${DISTRICT_FALLBACK_BASE}/PobleSec.webp`,
  'sarria-sant-gervasi': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
  'gracia': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
  'horta-guinardo': `${DISTRICT_FALLBACK_BASE}/SantGervasi.webp`,
  'sant-andreu': `${DISTRICT_FALLBACK_BASE}/NouBarris.webp`,
};

const DEFAULT_BARCELONA_COVER = `${DISTRICT_FALLBACK_BASE}/Eixample.webp`;

export function slugifyVisualKey(value?: string | null): string {
  if (!value) {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getBarcelonaIllustratedCover(params: {
  neighborhood?: string | null;
  district?: string | null;
}): string {
  const neighborhoodKey = slugifyVisualKey(params.neighborhood);
  if (neighborhoodKey && BARCELONA_NEIGHBORHOOD_COVERS[neighborhoodKey]) {
    return BARCELONA_NEIGHBORHOOD_COVERS[neighborhoodKey];
  }

  const districtKey = slugifyVisualKey(params.district);
  if (districtKey && BARCELONA_DISTRICT_COVERS[districtKey]) {
    return BARCELONA_DISTRICT_COVERS[districtKey];
  }

  return DEFAULT_BARCELONA_COVER;
}

export function getIllustratedCoverAlt(neighborhood?: string | null): string {
  return `Editorial illustration for ${neighborhood || 'Barcelona'}, Barcelona`;
}
