const DISTRICT_IMAGE_BASE = '/images/fallbacks/Districts';

const DISTRICT_IMAGE_BY_KEY: Record<string, string> = {
  'barceloneta': `${DISTRICT_IMAGE_BASE}/Barceloneta.webp`,
  'eixample': `${DISTRICT_IMAGE_BASE}/Eixample.webp`,
  'eixample-esquerra': `${DISTRICT_IMAGE_BASE}/EixampleEsquerra.webp`,
  'el-born': `${DISTRICT_IMAGE_BASE}/ElBorn.webp`,
  'el-raval': `${DISTRICT_IMAGE_BASE}/ElRaval.webp`,
  'gotic': `${DISTRICT_IMAGE_BASE}/Gotic.webp`,
  'les-corts': `${DISTRICT_IMAGE_BASE}/LesCorts.webp`,
  'nou-barris': `${DISTRICT_IMAGE_BASE}/NouBarris.webp`,
  'poblenou': `${DISTRICT_IMAGE_BASE}/Poblenou.webp`,
  'poble-sec': `${DISTRICT_IMAGE_BASE}/PobleSec.webp`,
  'sant-antoni': `${DISTRICT_IMAGE_BASE}/SantAntoni.webp`,
  'sant-gervasi': `${DISTRICT_IMAGE_BASE}/SantGervasi.webp`,
  'sarria': `${DISTRICT_IMAGE_BASE}/Sarria.webp`,
};

const BARCELONA_NEIGHBORHOOD_COVERS: Record<string, string> = {
  'barceloneta': DISTRICT_IMAGE_BY_KEY['barceloneta'],
  'eixample': DISTRICT_IMAGE_BY_KEY['eixample'],
  'eixample-dreta': DISTRICT_IMAGE_BY_KEY['eixample'],
  'dreta-de-l-eixample': DISTRICT_IMAGE_BY_KEY['eixample'],
  'eixample-esquerra': DISTRICT_IMAGE_BY_KEY['eixample-esquerra'],
  'l-antiga-esquerra-de-l-eixample': DISTRICT_IMAGE_BY_KEY['eixample-esquerra'],
  'la-nova-esquerra-de-l-eixample': DISTRICT_IMAGE_BY_KEY['eixample-esquerra'],
  'el-born': DISTRICT_IMAGE_BY_KEY['el-born'],
  'born': DISTRICT_IMAGE_BY_KEY['el-born'],
  'sant-pere': DISTRICT_IMAGE_BY_KEY['el-born'],
  'sant-pere-santa-caterina-i-la-ribera': DISTRICT_IMAGE_BY_KEY['el-born'],
  'el-raval': DISTRICT_IMAGE_BY_KEY['el-raval'],
  'raval': DISTRICT_IMAGE_BY_KEY['el-raval'],
  'gotic': DISTRICT_IMAGE_BY_KEY['gotic'],
  'gothic': DISTRICT_IMAGE_BY_KEY['gotic'],
  'barri-gotic': DISTRICT_IMAGE_BY_KEY['gotic'],
  'les-corts': DISTRICT_IMAGE_BY_KEY['les-corts'],
  'nou-barris': DISTRICT_IMAGE_BY_KEY['nou-barris'],
  'poblenou': DISTRICT_IMAGE_BY_KEY['poblenou'],
  'el-poblenou': DISTRICT_IMAGE_BY_KEY['poblenou'],
  'poble-sec': DISTRICT_IMAGE_BY_KEY['poble-sec'],
  'sant-antoni': DISTRICT_IMAGE_BY_KEY['sant-antoni'],
  'sant-gervasi': DISTRICT_IMAGE_BY_KEY['sant-gervasi'],
  'sant-gervasi-galvany': DISTRICT_IMAGE_BY_KEY['sant-gervasi'],
  'sarria': DISTRICT_IMAGE_BY_KEY['sarria'],
  'sarria-sant-gervasi': DISTRICT_IMAGE_BY_KEY['sarria'],
};

const BARCELONA_DISTRICT_COVERS: Record<string, string> = {
  'ciutat-vella': DISTRICT_IMAGE_BY_KEY['gotic'],
  'eixample': DISTRICT_IMAGE_BY_KEY['eixample'],
  'les-corts': DISTRICT_IMAGE_BY_KEY['les-corts'],
  'nou-barris': DISTRICT_IMAGE_BY_KEY['nou-barris'],
  'sant-marti': DISTRICT_IMAGE_BY_KEY['poblenou'],
  'sants-montjuic': DISTRICT_IMAGE_BY_KEY['poble-sec'],
  'sarria-sant-gervasi': DISTRICT_IMAGE_BY_KEY['sarria'],
};

const DEFAULT_BARCELONA_COVER = '/images/cities/barcelona-city.webp';

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
  return `District fallback image for ${neighborhood || 'Barcelona'}, Barcelona`;
}
