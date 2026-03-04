import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    ignores: [
      '.tmp-librarian/**',
      '**/.tmp-librarian/**',
      'tmp-*/**',
      '**/tmp-*/**',
      'lib/generated/**',
      '**/lib/generated/**',
    ],
  },
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "lib/generated/**",
    ],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);
