import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const projectRoot = process.cwd();
const materialDir = path.join(projectRoot, 'public', 'material');

const kitFiles = [
  {
    html: 'spain-safety-kit.html',
    pdf: 'spain-safety-kit-en.pdf',
  },
  {
    html: 'spain-safety-kit-es.html',
    pdf: 'spain-safety-kit-es.pdf',
  },
  {
    html: 'spain-safety-kit-fr.html',
    pdf: 'spain-safety-kit-fr.pdf',
  },
  {
    html: 'spain-safety-kit-de.html',
    pdf: 'spain-safety-kit-de.pdf',
  },
];

async function ensureMaterialFilesExist() {
  for (const file of kitFiles) {
    const inputPath = path.join(materialDir, file.html);
    await fs.access(inputPath);
  }
}

async function generatePdfs() {
  await ensureMaterialFilesExist();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: {
      width: 794,
      height: 1123,
    },
    deviceScaleFactor: 1,
  });

  try {
    await page.emulateMedia({ media: 'print' });

    for (const file of kitFiles) {
      const inputPath = path.join(materialDir, file.html);
      const outputPath = path.join(materialDir, file.pdf);

      await page.goto(pathToFileURL(inputPath).href, {
        waitUntil: 'networkidle',
      });

      await page.pdf({
        path: outputPath,
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
        preferCSSPageSize: true,
      });

      console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
    }
  } finally {
    await page.close();
    await browser.close();
  }
}

generatePdfs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
