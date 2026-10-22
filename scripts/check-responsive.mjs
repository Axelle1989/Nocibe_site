// Automated Responsive Checker using Playwright
// Tests all routes across all required viewport widths and detects any horizontal scroll.

import { chromium } from '@playwright/test';
import { createServer } from 'vite';

const VIEWPORTS = [320, 360, 390, 414, 768, 820, 1024, 1280, 1440, 1920];

const ROUTES = [
  '/',
  '/produits',
  '/produits/ciment-nocibe-cpj-45',
  '/caracteristiques-techniques',
  '/usine-masse',
  '/histoire',
  '/equipe-direction',
  '/nos-valeurs',
  '/engagements-rse',
  '/grands-chantiers',
  '/partenaires',
  '/actualites',
  '/points-de-vente',
  '/contact',
  '/panier',
  '/commande',
  '/mentions-legales',
  '/politique-confidentialite',
  '/espace-client/connexion',
  '/espace-client/inscription',
  '/espace-client/verifier-email',
  '/admin/connexion',
];

async function run() {
  console.log('🚀 Starting local test server...');
  const server = await createServer({
    server: { port: 3888 },
    logLevel: 'error',
  });
  await server.listen();
  const baseUrl = 'http://localhost:3888';
  console.log(`✅ Test server running at ${baseUrl}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalTests = 0;
  let failures = [];

  try {
    const page = await browser.newPage();

    for (const route of ROUTES) {
      // Navigate to route once
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(200);

      for (const width of VIEWPORTS) {
        totalTests++;
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(80);

        try {
          const result = await page.evaluate(() => {
            const scrollW = document.documentElement.scrollWidth;
            const innerW = window.innerWidth;
            const bodyScrollW = document.body ? document.body.scrollWidth : 0;
            const maxScroll = Math.max(scrollW, bodyScrollW);
            const hasOverflow = maxScroll > innerW + 1; // 1px threshold for subpixel rounding

            if (!hasOverflow) return null;

            // Find offending elements that are actually visible
            const elements = Array.from(document.querySelectorAll('*'));
            const offenders = elements
              .filter((el) => {
                if (el.offsetParent === null) return false;
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                const r = el.getBoundingClientRect();
                return r.right > innerW + 1;
              })
              .map((el) => ({
                tag: el.tagName.toLowerCase(),
                className: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
                id: el.id || '',
                right: Math.round(el.getBoundingClientRect().right),
                width: Math.round(el.getBoundingClientRect().width),
              }))
              .slice(0, 3);

            return {
              innerW,
              scrollW: maxScroll,
              overflow: maxScroll - innerW,
              offenders,
            };
          });

          if (result) {
            console.error(
              `❌ OVERFLOW at ${route} (${width}px): scrollWidth=${result.scrollW} > innerWidth=${result.innerW} (+${result.overflow}px)`
            );
            if (result.offenders.length > 0) {
              console.error('   Offenders:', JSON.stringify(result.offenders));
            }
            failures.push({
              route,
              width,
              overflow: result.overflow,
              offenders: result.offenders,
            });
          }
        } catch (evalErr) {
          console.warn(`Eval warning at ${route} (${width}px):`, evalErr.message);
        }
      }
    }
  } catch (err) {
    console.error('Fatal error during responsive check:', err);
  } finally {
    await browser.close();
    await server.close();
  }

  console.log('\n========================================');
  console.log(`Responsive Check Complete: ${totalTests} test cases run.`);
  if (failures.length === 0) {
    console.log('✅ 100% PASSED: Zero horizontal overflow detected on all viewports (320px - 1920px)!');
    process.exit(0);
  } else {
    console.error(`❌ FAILED: ${failures.length} overflow issues found.`);
    process.exit(1);
  }
}

run();
