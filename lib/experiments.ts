export interface ExperimentAssignment {
  arm: string;
  source: 'query' | 'storage' | 'random';
}

interface ResolveExperimentArmOptions {
  experimentId: string;
  allowedArms: readonly string[];
  searchParams?: URLSearchParams;
}

export function resolveExperimentArm({
  experimentId,
  allowedArms,
  searchParams,
}: ResolveExperimentArmOptions): ExperimentAssignment {
  if (typeof window === 'undefined') {
    return { arm: allowedArms[0], source: 'random' };
  }

  const storageKey = `scm.exp.${experimentId}.arm`;
  const queryArm = readQueryArm(experimentId, allowedArms, searchParams ?? new URLSearchParams(window.location.search));

  if (queryArm) {
    window.localStorage.setItem(storageKey, queryArm);
    return { arm: queryArm, source: 'query' };
  }

  const existing = window.localStorage.getItem(storageKey);
  if (existing && allowedArms.includes(existing)) {
    return { arm: existing, source: 'storage' };
  }

  const fallback = allowedArms[Math.floor(Math.random() * allowedArms.length)] ?? allowedArms[0];
  window.localStorage.setItem(storageKey, fallback);
  return { arm: fallback, source: 'random' };
}

function readQueryArm(
  experimentId: string,
  allowedArms: readonly string[],
  searchParams: URLSearchParams
): string | null {
  const directArm = searchParams.get(`${experimentId}_arm`);
  if (directArm && allowedArms.includes(directArm)) {
    return directArm;
  }

  const exp = searchParams.get('exp');
  const arm = searchParams.get('arm');
  if (exp === experimentId && arm && allowedArms.includes(arm)) {
    return arm;
  }

  return null;
}
