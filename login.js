const { test, expect, chromium } = require('@playwright/test');
require('dotenv').config();

async function runLoginTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting login at:', new Date().toLocaleString());

  await context.tracing.start({ screenshots: true, snapshots: true });

  // Take care of myself
  await page.goto('https://utopia-game.com/shared/?next=/wol/game/throne');
  await page.fill('#id_username', process.env.USERNAME);
  await page.fill('#id_password', process.env.PASSWORD);
  await page.click('.g-recaptcha');
  await page.waitForLoadState('domcontentloaded');
  const royalCommand = await page.$('#throne-monarch-message');
  expect(royalCommand).not.toBeNull();

  // then do the sitter with the same authentication
  await page.goto('https://utopia-game.com/wol/sit/game/throne');
  await page.waitForLoadState('domcontentloaded');
  const royalCommand2 = await page.$('#throne-monarch-message');
  expect(royalCommand2).not.toBeNull();

  await context.tracing.stop({ path: 'data/trace.zip' });

  await browser.close();

  console.log('Login completed at:', new Date().toLocaleString());
}

function scheduleNextRun() {
  // Calculate the delay until the next hour and add a random delay of 1-5 minutes
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
  const randomDelay = Math.floor(Math.random() * 4 + 1) * 60 * 1000;
  const totalDelay = nextHour.getTime() - now.getTime() + randomDelay;

  const nextRunTime = new Date(now.getTime() + totalDelay);
  const minutesUntilNextRun = totalDelay / 1000 / 60;

  console.log(`Next login scheduled at ${nextRunTime.toLocaleString()} (in ${minutesUntilNextRun.toFixed(2)} minutes)`);

  // Schedule the next run
  setTimeout(() => {
    runLoginTest().then(() => {
      scheduleNextRun(); // Schedule the subsequent run
    });
  }, totalDelay);
}

// Run the test immediately and schedule the next runs
runLoginTest().then(() => {
  scheduleNextRun();
});
