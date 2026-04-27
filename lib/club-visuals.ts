const BARCELONA_NEIGHBORHOOD_COVERS: Record<string, string> = {
  'eixample': '/images/editorial/barcelona-gaudi-house.webp',
  'eixample-dreta': '/images/editorial/barcelona-gaudi-house.webp',
  'eixample-esquerra': '/images/editorial/barcelona-gaudi-house.webp',
  'gracia': '/images/editorial/barcelona-parc-guel.webp',
  'poblenou': '/images/editorial/barcelona-plaza-espana.webp',
  'el-raval': '/images/editorial/barcelona-vs-amsterdam.webp',
  'les-corts': '/images/cities/barcelona-city.webp',
  'sant-antoni': '/images/editorial/barcelona-plaza-espana.webp',
  'el-born': '/images/editorial/barcelona-gaudi-house.webp',
  'gotic': '/images/editorial/barcelona-gaudi-house.webp',
  'barceloneta': '/images/cities/barcelona-city.webp',
  'poble-sec': '/images/editorial/barcelona-plaza-espana.webp',
  'sant-gervasi': '/images/editorial/barcelona-parc-guel.webp',
  'sarria': '/images/editorial/barcelona-parc-guel.webp',
  'nou-barris': '/images/cities/barcelona-city.webp',
  'horta-guinardo': '/images/editorial/barcelona-parc-guel.webp',
  'sant-andreu': '/images/cities/barcelona-city.webp',
  'sant-pere': '/images/editorial/barcelona-gaudi-house.webp',
};

const BARCELONA_DISTRICT_COVERS: Record<string, string> = {
  'eixample': '/images/editorial/barcelona-gaudi-house.webp',
  'ciutat-vella': '/images/editorial/barcelona-vs-amsterdam.webp',
  'sant-marti': '/images/editorial/barcelona-plaza-espana.webp',
  'les-corts': '/images/cities/barcelona-city.webp',
  'sants-montjuic': '/images/editorial/barcelona-plaza-espana.webp',
  'sarria-sant-gervasi': '/images/editorial/barcelona-parc-guel.webp',
  'gracia': '/images/editorial/barcelona-parc-guel.webp',
  'nou-barris': '/images/cities/barcelona-city.webp',
  'horta-guinardo': '/images/editorial/barcelona-parc-guel.webp',
  'sant-andreu': '/images/cities/barcelona-city.webp',
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
