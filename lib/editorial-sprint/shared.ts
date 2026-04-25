export const SCM_EDITORIAL_DISCLAIMER =
  'SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt.';

export const SPRINT_INTERNAL_LINKS = {
  clubsExplainer: '/en/editorial/what-are-cannabis-social-clubs-spain',
  laws: '/en/editorial/spain-cannabis-laws-tourists',
  safetyKit: '/en/editorial/safety-kit-visitors-spain',
  scams: '/en/editorial/scams-red-flags',
  firstVisit: '/en/editorial/first-time-barcelona-cannabis-club',
  mission: '/en/mission#verification-standard',
} as const;

export function localizeEditorialPath(path: string, locale: string) {
  return path.replace(/^\/en\//, `/${locale}/`);
}
