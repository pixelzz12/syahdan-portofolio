/* Optional browser QA. Install Playwright separately, or set NOVA_PLAYWRIGHT_PATH
 * to an existing Playwright package. No browser tooling is shipped to visitors. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.NOVA_PLAYWRIGHT_PATH || 'playwright');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.NOVA_BROWSER_PATH ? { executablePath: process.env.NOVA_BROWSER_PATH } : {}),
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const baseURL = process.env.NOVA_BASE_URL || 'http://localhost:3000';
  const sceneURL = new URL(baseURL);
  sceneURL.searchParams.set('scene-qa', '1');
  const output = '.qa';
  await fs.mkdir(output, { recursive: true });
  const issues = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => issues.push(error.message));
    const response = await page.goto(sceneURL.href, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.waitForSelector('canvas');
    await page.waitForFunction(() => !document.querySelector('.loading-note'));
    const scene = async () => JSON.parse(await page.locator('canvas').getAttribute('data-scene'));
    const waitSettled = async () => {
      await page.evaluate(() => { window.__novaSettle = null; });
      await page.waitForFunction(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas?.dataset.scene) return false;
        const data = JSON.parse(canvas.dataset.scene);
        const current = [...data.camera, ...data.quaternion];
        const previous = window.__novaSettle;
        if (previous?.stamp === canvas.dataset.sampleTime) return false;
        const difference = previous ? Math.hypot(...current.map((v, i) => v - previous.values[i])) : Infinity;
        const stable = difference < 0.00002 ? (previous?.stable || 0) + 1 : 0;
        window.__novaSettle = { values: current, stamp: canvas.dataset.sampleTime, stable };
        return stable >= 3;
      }, null, { polling: 100, timeout: 45000 });
    };
    const waitCorridor = async () => {
      await page.locator('.facility-viewport[data-phase="corridor"]').waitFor();
      await page.waitForFunction(() => JSON.parse(document.querySelector('canvas').dataset.scene || '{}').phase === 'corridor');
      await waitSettled();
    };
    const scrollTo = async fraction => {
      await page.evaluate(value => window.scrollTo({ top: (document.querySelector('.facility-track').offsetHeight - innerHeight) / 3 * (1 + value), behavior: 'instant' }), fraction);
      await waitSettled();
    };
    const inspectSector = async number => {
      await page.locator('.room-hud').waitFor();
      await page.getByRole('button', { name: 'Baca sektor ☷', exact: true }).click();
      await page.locator('dialog[open]').waitFor();
    };
    const leaveSector = async number => {
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({ state: 'detached' });
      await page.getByRole('button', { name: 'Kembali ke koridor', exact: true }).click();
      await waitCorridor();
    };
    await waitCorridor();
    await page.screenshot({ path: `${output}/desktop.png` });
    const initial = await scene();
    await scrollTo(0.08);
    const advanced = await scene();
    assert.ok(initial.camera[2] - advanced.camera[2] > 3, 'Perspective camera must translate forward in world space');
    const near = id => Math.abs(advanced.doors.find(d => d.id === id).x - initial.doors.find(d => d.id === id).x);
    assert.ok(near('development') > near('workshop') * 1.3, 'Near geometry must move farther on screen than distant geometry (parallax)');
    await scrollTo(0);
    const reversed = await scene();
    assert.ok(Math.abs(initial.camera[2] - reversed.camera[2]) < 0.15, 'Reverse scroll must return the physical camera');
    await fs.writeFile(`${output}/camera-measurements.json`, JSON.stringify({ initial, advanced, reversed, nearPixelShift: near('development'), farPixelShift: near('workshop') }, null, 2));
    await scrollTo(0.47);
    await page.screenshot({ path: `${output}/corridor-scroll.png` });
    const directoryBox = await page.locator('.directory').boundingBox();
    assert.ok(directoryBox.width * directoryBox.height < 1440 * 1000 * 0.1, 'Directory should leave the environment visible');
    assert.equal(await page.locator('.directory-item:visible').count(), 0);
    await page.locator('.directory-heading').click();

    // Click all six real 3D mesh hit areas at their projected positions.
    const fractions = [0.02, 0.16, 0.3, 0.42, 0.55, 0.7];
    const ids = ['operator', 'development', 'film', 'workshop', 'research', 'transmission'];
    for (let i = 0; i < ids.length; i++) {
      await scrollTo(fractions[i]);
      const before = await scene();
      const door = before.doors.find(d => d.id === ids[i]);
      assert.ok(door.visible, `Physical door ${door.number} must be in the camera frustum`);
      const unblocked = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.tagName === 'CANVAS', door);
      assert.ok(unblocked, `Physical door ${door.number} must not be covered by UI`);
      const scrollBefore = await page.evaluate(() => scrollY);
      await page.mouse.click(door.x, door.y);
      await inspectSector(door.number);
      await page.waitForFunction(() => JSON.parse(document.querySelector('canvas').dataset.scene || '{}').phase === 'room');
      assert.match(await page.locator('dialog .dialog-top').innerText(), new RegExp(`SECTOR ${door.number}`));
      const entered = await scene();
      assert.ok(Math.abs(entered.camera[0]) > 5, 'Camera must physically cross the door threshold into the vestibule');
      await leaveSector(door.number);
      const returned = await scene();
      assert.ok(Math.hypot(...returned.camera.map((v, axis) => v - before.camera[axis])) < 0.2, 'Return must restore the saved corridor position');
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - scrollBefore) < 2, 'Door visits must preserve scroll position');
      console.log(`Verified physical door ${door.number}: entry, content, and return.`);
    }
    // Preserve one-click HTML access to all six sectors as well.
    for (const number of ['01', '02', '03', '04', '05', '06']) {
      if(await page.locator('.directory-heading').getAttribute('aria-expanded')==='false')await page.locator('.directory-heading').click();
      await page.getByRole('button', { name: new RegExp(`Buka sektor ${number}:`) }).click();
      await inspectSector(number);
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      assert.ok(await page.locator('dialog h2').textContent());
      if (number === '03') {
        await page.getByRole('button', { name: 'Street', exact: true }).click();
        assert.equal(await page.getByRole('button', { name: 'Street', exact: true }).getAttribute('aria-pressed'), 'true');
        await page.getByRole('heading', { name: 'Belum ada foto di ruang ini.' }).waitFor();
      }
      if (number === '05') assert.match(await page.locator('dialog').innerText(), /belum terhubung ke AI/);
      if (number === '05') {
        const samples = [];
        for (let i = 0; i < 5; i++) { await page.waitForTimeout(300); samples.push((await scene()).evHeight); }
        assert.ok(Math.max(...samples) - Math.min(...samples) > 0.001, 'EV must have a small real idle animation');
        assert.equal((await scene()).aiProjectionCount, 1, 'Only one AI-core projection is present');
      }
      if (number === '06') assert.equal(await page.locator('dialog a').count(), 0, 'Missing contacts must not create fake links');
      await leaveSector(number);
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    }
    if(await page.locator('.directory-heading').getAttribute('aria-expanded')==='false')await page.locator('.directory-heading').click();
    await page.getByRole('button', { name: /Buka sektor 01:/ }).click();
    await page.getByRole('button', { name: 'Batalkan / Esc' }).click();
    await waitCorridor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.getByRole('button', { name: /Buka sektor 02:/ }).click();
    await page.getByRole('button', { name: 'Mode baca', exact: true }).click();
    assert.equal(await page.locator('.reading-sector:visible').count(), 6);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.getByRole('button', { name: 'Jelajahi 3D', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('.loading-note'));
    await page.getByRole('button', { name: 'Mode baca', exact: true }).click();
    assert.equal(await page.locator('.reading-sector:visible').count(), 6);
    await page.screenshot({ path: `${output}/reading-mode.png`, fullPage: true });
    await page.getByRole('link', { name: /05.*AI lokal/ }).click();
    assert.ok(new URL(page.url()).hash === '#research');

    await page.close();
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    mobile.on('pageerror', error => issues.push(error.message));
    await mobile.goto(sceneURL.href, { waitUntil: 'networkidle' });
    await mobile.waitForFunction(() => !document.querySelector('.loading-note'));
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await mobile.screenshot({ path: `${output}/mobile.png` });
    await mobile.locator('.directory-heading').tap();
    await mobile.getByRole('button', { name: /Buka sektor 01:/ }).tap();
    await mobile.locator('.room-hud[data-room="operator"]').waitFor();
    await mobile.screenshot({ path: `${output}/mobile-room-operator.png` });
    await mobile.getByRole('button', { name: 'Baca sektor ☷', exact: true }).tap();
    await mobile.locator('dialog[open]').waitFor();
    await mobile.screenshot({ path: `${output}/mobile-panel.png` });
    await mobile.getByRole('button', { name: 'Tutup detail dan kembali ke ruangan' }).tap();
    await mobile.getByRole('button', { name: 'Kembali ke koridor', exact: true }).tap();
    await mobile.locator('.facility-viewport[data-phase="corridor"]').waitFor();
    await mobile.getByRole('button', { name: 'Mode baca', exact: true }).tap();
    assert.equal(await mobile.locator('.reading-sector:visible').count(), 6);
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    await mobile.close();
    const noGL = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await noGL.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (String(type).includes('webgl')) return null;
        return original.call(this, type, ...args);
      };
    });
    await noGL.goto(baseURL, { waitUntil: 'networkidle' });
    await noGL.getByRole('status').filter({ hasText: 'Tampilan 3D tidak tersedia' }).waitFor();
    assert.equal(await noGL.locator('.reading-sector:visible').count(), 6);
    await noGL.screenshot({ path: `${output}/webgl-fallback.png` });

    await noGL.close();
    const reduced = await browser.newPage({ reducedMotion: 'reduce' });
    await reduced.goto(sceneURL.href, { waitUntil: 'networkidle' });
    await reduced.waitForFunction(() => !document.querySelector('.loading-note'));
    await reduced.locator('.directory-heading').click();
    await reduced.getByRole('button', { name: /Buka sektor 05:/ }).click();
    await reduced.locator('.room-hud[data-room="research"]').waitFor();
    await reduced.getByRole('button', { name: 'Baca sektor ☷', exact: true }).click();
    await reduced.locator('dialog[open]').waitFor();
    await reduced.keyboard.press('Escape');
    await reduced.locator('.directory-heading').click();
    await reduced.getByRole('button', { name: /Buka sektor 06:/ }).click();
    await reduced.locator('.room-hud[data-room="transmission"]').waitFor();
    await reduced.getByRole('button', { name: 'Baca sektor ☷', exact: true }).click();
    await reduced.locator('dialog h2').filter({ hasText: 'Transmission Room' }).waitFor();
    assert.match(await reduced.locator('dialog h2').textContent(), /Transmission/);
    await reduced.keyboard.press('Escape');
    await reduced.getByRole('button', { name: 'Kembali ke koridor', exact: true }).click();
    await reduced.locator('.facility-viewport[data-phase="corridor"]').waitFor();
    await reduced.locator('canvas').evaluate(canvas => canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await reduced.getByRole('status').filter({ hasText: 'Tampilan 3D tidak tersedia' }).waitFor();
    assert.equal(await reduced.locator('.reading-sector:visible').count(), 6);

    await reduced.close();
    for (const viewport of [{ width: 320, height: 640 }, { width: 844, height: 390 }]) {
      const compact = await browser.newPage({ viewport, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      await compact.goto(baseURL, { waitUntil: 'networkidle' });
      await compact.waitForFunction(() => !document.querySelector('.loading-note'));
      assert.equal(await compact.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await compact.locator('.directory-heading').click();
      assert.equal(await compact.locator('.directory-item:visible').count(), 6);
      await compact.screenshot({ path: `${output}/mobile-${viewport.width}.png` });
      await compact.close();
    }

    const noJS = await browser.newPage({ javaScriptEnabled: false });
    await noJS.goto(baseURL);
    assert.equal(await noJS.locator('.reading-sector:visible').count(), 6);
    assert.equal(await noJS.getByRole('heading', { name: 'Operator’s Quarters', exact: true }).count(), 1);

    assert.deepEqual(issues, [], 'No uncaught browser errors');
    console.log('PASS: production HTTP, all SIX physical 3D doors, measured forward/reverse camera translation and near/far parallax, threshold entry and saved-position return, directory collapse and all six links, transition cancellation, dialog/escape/scroll lock, gallery filters, honest contacts, reading navigation, mobile/touch/landscape, WebGL fallback, reduced motion, no-JS HTML.');
    console.log(`Screenshots saved in ${output}/`);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
