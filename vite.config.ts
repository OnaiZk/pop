import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { openBrowser } from '@remotion/renderer';

function pdfExportPlugin(): Plugin {
  return {
    name: 'eletromidia-pdf-export',
    configureServer(server) {
      server.middlewares.use('/api/sync-custom-pops', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const backupPath = path.resolve('src', 'data', 'custom-pops-backup.json');
            fs.writeFileSync(backupPath, body, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 500;
            res.end(String(err));
          }
        });
      });

      server.middlewares.use('/api/export-pdf', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const { pop } = JSON.parse(body);
            if (!pop || !pop.id) {
              res.statusCode = 400;
              res.end('Invalid POP payload');
              return;
            }

            const address = server.httpServer?.address();
            const port =
              typeof address === 'object' && address && 'port' in address ? address.port : 5174;

            const browser = await openBrowser('chrome', {
              browserExecutable: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            });

            try {
              const page = await browser.newPage(() => null, 'info', false);
              const targetUrl = `http://localhost:${port}/?pop=${encodeURIComponent(pop.id)}&view=pdf`;

              await page.goto({ url: targetUrl, timeout: 30000 });

              // Inject edited POP data into localStorage and reload so React renders the exact edited state
              const storagePayload = JSON.stringify({ [pop.id]: pop });
              await page._client().send('Runtime.evaluate', {
                expression: `localStorage.setItem('eletromidia_pops_custom_v1', ${JSON.stringify(storagePayload)});`,
              });

              await page.goto({ url: targetUrl, timeout: 30000 });
              await new Promise((r) => setTimeout(r, 900));

              const { value } = await page._client().send('Page.printToPDF', {
                printBackground: true,
                preferCSSPageSize: true,
                displayHeaderFooter: false,
              });

              const pdfBuffer = Buffer.from(value.data, 'base64');

              // Persist updated static PDF in public/pdfs/<id>.pdf as well
              const outDir = path.resolve('public', 'pdfs');
              fs.mkdirSync(outDir, { recursive: true });
              fs.writeFileSync(path.join(outDir, `${pop.id}.pdf`), pdfBuffer);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Length', pdfBuffer.length);
              res.end(pdfBuffer);
            } finally {
              await browser.close(true, 'info', false);
            }
          } catch (err) {
            console.error('PDF export error:', err);
            res.statusCode = 500;
            res.end(String(err));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), pdfExportPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
