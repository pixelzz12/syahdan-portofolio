/* Room interaction QA. Synthetic images below are test-only local uploads, never portfolio assets. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require(process.env.NOVA_PLAYWRIGHT_PATH || 'playwright');

async function run() {
  const browser = await chromium.launch({ headless: true, ...(process.env.NOVA_BROWSER_PATH ? { executablePath: process.env.NOVA_BROWSER_PATH } : {}), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const url = new URL(process.env.NOVA_BASE_URL || 'http://localhost:3000'); url.searchParams.set('scene-qa', '1');
  const errors = [];
  browser.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  await fs.mkdir('.qa', { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(url.href, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !document.querySelector('.loading-note'));
    async function room(number, id) {
      if (await page.locator('.directory-heading').getAttribute('aria-expanded') === 'false') await page.locator('.directory-heading').click();
      await page.getByRole('button', { name: new RegExp(`Buka sektor ${number}:`) }).click();
      await page.locator(`.room-hud[data-room="${id}"]`).waitFor();
      await page.waitForFunction(() => JSON.parse(document.querySelector('canvas').dataset.scene || '{}').phase === 'room');
      await page.waitForTimeout(400);
      await page.screenshot({ path: `.qa/room-${id}.png` });
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    }
    async function object(id, heading) {
      let hit;
      for (const view of [0, 1, 2]) {
        await page.locator('.room-view-buttons button').nth(view).click();
        await page.waitForTimeout(500);
        const scene = JSON.parse(await page.locator('canvas').getAttribute('data-scene'));
        const target = scene.objects.find(item => item.id === id);
        if (target?.visible && await page.evaluate(p => document.elementFromPoint(p.x, p.y)?.tagName === 'CANVAS', target)) { hit = target; break; }
      }
      assert.ok(hit, `Physical object ${id} must be reachable in one room view`);
      await page.mouse.click(hit.x, hit.y);
      await page.locator('dialog[open]').waitFor();
      assert.equal(await page.locator('dialog h2').innerText(), heading);
      console.log(`Verified room mesh: ${id}`);
    }
    async function close() {
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({ state: 'detached' });
      assert.equal(await page.locator('.room-hud').count(), 1);
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    }
    await room('01', 'operator');
    for (const [id, label] of [['profile-terminal','Profil operator'],['operator-camera','Kamera & fotografi'],['operator-notebook','Catatan & minat'],['university-plaque','Pendidikan / UNAIR']]) {
      await object(id, label);
      if (id === 'profile-terminal') assert.match(await page.locator('dialog').innerText(), /Muhammad Syahdan Herdhiyanta/);
      if (id === 'university-plaque') assert.match(await page.locator('dialog').innerText(), /Universitas Airlangga/);
      await close();
    }
    await room('02', 'development');
    for (const [id, label] of [['project-personal','Website personal'],['project-campus','Campus Expo'],['project-coding','Coding'],['project-design','UI/UX']]) {
      await object(id, label);
      if (id === 'project-campus') assert.match(await page.locator('dialog').innerText(), /Dalam Pengembangan/);
      assert.equal(await page.locator('dialog .terminal-detail img').count(), 0, 'No invented screenshots');
      await close();
    }
    await room('03', 'film');
    await object('photo-archive', 'Buka arsip foto');
    await page.getByRole('button', { name: /Lihat 16 slot arsip/ }).click();
    assert.equal(await page.locator('dialog .archive-slots>div').count(), 16);
    assert.equal(await page.locator('dialog img').count(), 0, 'No invented photographs');
    await close();
    await object('print-01', 'Slot foto 01');
    assert.match(await page.locator('dialog').innerText(), /bukan karya fotografi/);
    await close();
    await object('grading-console', 'Inspeksi / grading');
    const fixtures = await page.evaluate(() => ['#b74836', '#346aab'].map(color => { const canvas = document.createElement('canvas'); canvas.width = 80; canvas.height = 50; const ctx = canvas.getContext('2d'); ctx.fillStyle = color; ctx.fillRect(0,0,80,50); return canvas.toDataURL('image/png').split(',')[1]; }));
    await page.getByLabel('Foto sebelum', { exact: true }).setInputFiles({ name: 'TEST-ONLY-before.png', mimeType: 'image/png', buffer: Buffer.from(fixtures[0], 'base64') });
    await page.getByLabel('Foto sesudah', { exact: true }).setInputFiles({ name: 'TEST-ONLY-after.png', mimeType: 'image/png', buffer: Buffer.from(fixtures[1], 'base64') });
    const slider = page.getByRole('slider', { name: 'Bandingkan sebelum dan sesudah color grading' });
    await page.getByLabel('Saya memastikan kedua foto memiliki framing yang sama.').check();
    await slider.focus(); await page.keyboard.press('Home');
    assert.equal(await slider.inputValue(), '0');
    assert.match(await page.locator('.before-image').getAttribute('style'), /100%/);
    await page.keyboard.press('End'); assert.equal(await slider.inputValue(), '100');
    const image = await page.locator('.comparison.paired').boundingBox();
    await page.mouse.move(image.x + image.width * 0.5, image.y + image.height * 0.5); await page.mouse.down(); await page.mouse.move(image.x + image.width * 0.75, image.y + image.height * 0.5); await page.mouse.up();
    assert.ok(Math.abs(Number(await slider.inputValue()) - 75) <= 1, 'Dragging the real image must change the clipping boundary');
    assert.match(await page.locator('dialog').innerText(), /tidak diunggah/);
    await page.screenshot({ path: '.qa/grading-local-fixtures.png' });
    await close();
    await object('grading-console', 'Inspeksi / grading');
    assert.equal(await page.getByRole('slider').count(), 0, 'Temporary local files must be cleared on close');
    await close();
    await room('04', 'workshop');
    for (const [id, label] of [['experiment-esp32','ESP32-C3 / OLED'], ['experiment-arduino','Eksperimen Arduino'], ['experiment-ledger','Status eksperimen']]) {
      await object(id, label);
      if (id === 'experiment-ledger') assert.match(await page.locator('dialog').innerText(), /Belum ada eksperimen selesai/);
      else assert.match(await page.locator('dialog').innerText(), /Status belum dikonfirmasi/);
      await close();
    }
    await room('05', 'research');
    for (const [id, label] of [['research-laptop','Asisten LLM lokal'], ['homelab-rack','Homelab server'], ['ai-core','Proyeksi AI / prototipe'], ['ev-robot','EV / rencana integrasi']]) {
      await object(id, label);
      assert.match(await page.locator('dialog').innerText(), /Dalam Pengembangan/);
      assert.equal(await page.locator('dialog input[type="text"],dialog textarea').count(), 0, 'No fake chat controls');
      await close();
    }
    const researchA = JSON.parse(await page.locator('canvas').getAttribute('data-scene'));
    await page.waitForTimeout(600);
    const researchB = JSON.parse(await page.locator('canvas').getAttribute('data-scene'));
    assert.equal(researchA.aiProjectionCount, 1);
    assert.equal(researchA.evHeight, researchB.evHeight, 'Reduced-motion preference must stop EV idle movement');
    await room('06', 'transmission');
    for (const [id, label] of [['contact-terminal','Terminal kontak'], ['contact-email','Email'], ['contact-github','GitHub'], ['contact-instagram','Instagram']]) {
      await object(id, label);
      assert.equal(await page.locator('dialog a').count(), 0, 'Unconfigured contact channels must not create external links');
      assert.equal(await page.locator('dialog .contact-channel button:disabled').count(), id === 'contact-terminal' ? 3 : 1);
      await close();
    }
    await page.getByRole('button', { name: 'Kembali ke koridor', exact: true }).click();
    await page.locator('.facility-viewport[data-phase="corridor"]').waitFor();
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await mobile.goto(url.href, { waitUntil: 'networkidle' });
    await mobile.waitForFunction(() => !document.querySelector('.loading-note'));
    for (const [number, id] of [['01','operator'],['02','development'],['03','film'],['04','workshop'],['05','research'],['06','transmission']]) {
      if (await mobile.locator('.directory-heading').getAttribute('aria-expanded') === 'false') await mobile.locator('.directory-heading').tap();
      await mobile.getByRole('button', { name: new RegExp(`Buka sektor ${number}:`) }).tap();
      await mobile.locator(`.room-hud[data-room="${id}"]`).waitFor();
      assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await mobile.screenshot({ path: `.qa/room-mobile-${id}.png` });
      await mobile.getByRole('button', {name:'Objek +',exact:true}).tap();
      await mobile.locator('.room-objects button').first().tap();
      await mobile.locator('dialog[open]').waitFor();
      await mobile.getByRole('button', { name: 'Tutup detail dan kembali ke ruangan' }).tap();
      await mobile.locator('.room-view-buttons button').nth(2).tap();
    }
    await mobile.getByRole('button', { name: 'Kembali ke koridor', exact: true }).tap();
    await mobile.locator('.facility-viewport[data-phase="corridor"]').waitFor();
    await mobile.getByRole('button', { name: 'Mode baca', exact: true }).tap();
    await mobile.locator('#film .grading-inline summary').filter({hasText:'Meja inspeksi'}).click();
    await mobile.locator('#film .local-photo-inputs input').first().waitFor();
    assert.equal(await mobile.locator('#film .local-photo-inputs input:visible').count(), 2, 'The inspection interface must also be available in HTML reading mode');
    await mobile.locator('#film .grading-inline summary').filter({hasText:'Meja inspeksi'}).click();
    await mobile.locator('#film .local-photo-inputs input').first().waitFor({ state: 'detached' });
    assert.equal(await mobile.locator('#film .local-photo-inputs input').count(), 0, 'Closing inline inspection disposes its temporary photo state');
    assert.deepEqual(errors, []);
    console.log('PASS: all SIX physical interiors and their object meshes; room-to-room travel; honest experiment statuses; local LLM and homelab in development; ONE AI-core projection; EV respects reduced motion; no fake chat; disabled unconfigured contact links; 16 honest photo slots; real before-after interaction with test-only local files; preview cleanup; all SIX rooms on touch mobile.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
