export type SafetyKitLocale = 'en' | 'es' | 'fr' | 'de';

const supportedSafetyKitLocales = new Set<SafetyKitLocale>(['en', 'es', 'fr', 'de']);

const safetyKitHtmlFiles: Record<SafetyKitLocale, string> = {
  en: 'spain-safety-kit.html',
  es: 'spain-safety-kit-es.html',
  fr: 'spain-safety-kit-fr.html',
  de: 'spain-safety-kit-de.html',
};

const safetyKitPdfFiles: Record<SafetyKitLocale, string> = {
  en: 'spain-safety-kit-en.pdf',
  es: 'spain-safety-kit-es.pdf',
  fr: 'spain-safety-kit-fr.pdf',
  de: 'spain-safety-kit-de.pdf',
};

export function normalizeSafetyKitLocale(locale?: string): SafetyKitLocale {
  if (locale && supportedSafetyKitLocales.has(locale as SafetyKitLocale)) {
    return locale as SafetyKitLocale;
  }

  return 'en';
}

export function getSafetyKitGuidePath(locale: SafetyKitLocale) {
  return `/${locale}/editorial/safety-kit-visitors-spain`;
}

export function getSafetyKitHtmlPath(locale: SafetyKitLocale) {
  return `/material/${safetyKitHtmlFiles[locale]}`;
}

export function getSafetyKitPdfPath(locale: SafetyKitLocale) {
  return `/material/${safetyKitPdfFiles[locale]}`;
}

export function getSafetyKitForcedDownloadPath(locale: SafetyKitLocale) {
  return `/api/safety-kit/download?locale=${locale}`;
}

export function getSafetyKitAssetPaths(locale: SafetyKitLocale) {
  return {
    guidePath: getSafetyKitGuidePath(locale),
    pdfPath: getSafetyKitPdfPath(locale),
    downloadPath: getSafetyKitForcedDownloadPath(locale),
    htmlPath: getSafetyKitHtmlPath(locale),
  };
}
