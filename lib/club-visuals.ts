const EDITORIAL_IMAGE_BASE = '/images/editorial';

const BARCELONA_NEIGHBORHOOD_COVERS: Record<string, string> = {
  'barceloneta': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'eixample': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'eixample-dreta': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'dreta-de-l-eixample': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'eixample-esquerra': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'l-antiga-esquerra-de-l-eixample': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'la-nova-esquerra-de-l-eixample': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'el-born': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'born': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'sant-pere': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'sant-pere-santa-caterina-i-la-ribera': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'el-raval': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'raval': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'gotic': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'gothic': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'barri-gotic': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'gracia': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'les-corts': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'nou-barris': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'poblenou': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'el-poblenou': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'poble-sec': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'sant-antoni': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'sant-gervasi': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'sant-gervasi-galvany': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'sarria': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'sarria-sant-gervasi': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
};

const BARCELONA_DISTRICT_COVERS: Record<string, string> = {
  'ciutat-vella': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'eixample': `${EDITORIAL_IMAGE_BASE}/barcelona-gaudi-house.webp`,
  'les-corts': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'nou-barris': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'sant-marti': `${EDITORIAL_IMAGE_BASE}/barcelona-vs-amsterdam.webp`,
  'sants-montjuic': `${EDITORIAL_IMAGE_BASE}/barcelona-plaza-espana.webp`,
  'sarria-sant-gervasi': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'gracia': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'horta-guinardo': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
  'sant-andreu': `${EDITORIAL_IMAGE_BASE}/barcelona-parc-guel.webp`,
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
  return `Editorial illustration for ${neighborhood || 'Barcelona'}, Barcelona`;
}
