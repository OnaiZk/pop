import fs from 'node:fs';
import path from 'node:path';
import { openBrowser } from '@remotion/renderer';

const POPS = [
  'preventiva-totens',
  'lavagem-abrigo-totem',
  'fundacao-totem-abrigo',
];

async function main() {
  const outDir = path.resolve('public', 'pdfs');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await openBrowser('chrome', {
    browserExecutable: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  try {
    const page = await browser.newPage(() => null, 'info', false);

    const port = process.env.PORT || '5173';
    for (const popId of POPS) {
      const url = `http://localhost:${port}/?pop=${popId}&view=pdf`;
      console.log(`Navigating to ${url}...`);
      await page.goto({
        url,
        timeout: 30000,
      });

      // Wait briefly for SVG/fonts to settle
      await new Promise((r) => setTimeout(r, 1500));

      const { value } = await page._client().send('Page.printToPDF', {
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      const pdfBuffer = Buffer.from(value.data, 'base64');
      const filePath = path.join(outDir, `${popId}.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);
      console.log(`Saved ${filePath} (${pdfBuffer.length} bytes)`);
    }
  } finally {
    await browser.close(true, 'info', false);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
