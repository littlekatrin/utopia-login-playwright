const { test, expect, chromium } = require('@playwright/test');
require('dotenv').config();

async function doLogin(page, platform) {
  await page.goto(`https://utopia-game.com/shared/?next=/${platform}/game/throne`);
  await page.fill('#id_username', process.env.UTO_USERNAME);
  await page.fill('#id_password', process.env.UTO_PASSWORD);
  await page.click('.g-recaptcha');
  await page.waitForLoadState('domcontentloaded');
  await page.$('#throne-monarch-message');
}

async function getCurrentSpells(page) {
  const spans = await page.$$('span.good');
  let activeSpells = [];

  for (const span of spans) {
    const textContent = await span.textContent();
    let currentSpell = textContent.trim().toUpperCase().replace(/ /g, '_');
    let currentDuration = await span.evaluate(node => node.nextSibling.textContent.trim());
    if (currentDuration.includes('( - )')) {
      currentDuration = 0;
    } else {
      currentDuration = parseInt(currentDuration.match(/\((\d+) days?\)/)[1], 10);
    }
    activeSpells.push({
      name: currentSpell,
      duration: currentDuration,
    });
  }
  for (const spell of activeSpells) {
    console.log(`Active Spell: ${spell.name} (${spell.duration} days)`);
  }
  return activeSpells;
}

async function castSpells(page, platform, spells, sitter = false) {
  // Go to the Mystics page
  const url = sitter ? `https://utopia-game.com/${platform}/sit/game/enchantment` : `https://utopia-game.com/${platform}/game/enchantment`;
  await page.goto(url);
  for (const spell of spells) {
    console.log(`Casting ${spell} ...`);
    await page.selectOption('#id_self_spell', spell);
    await page.click('input.button[type="submit"]');
  }
}

async function checkAndCastSpells(page, platform, spells, sitter = false) {
  const activeSpells = await getCurrentSpells(page);
  const spellsToCast = spells.filter(spell => {
    const activeSpell = activeSpells.find(active => active.name === spell);
    return !activeSpell || activeSpell.duration === 0;
  });

  if (spellsToCast.length > 0) {
    await castSpells(page, platform, spellsToCast, sitter);
  }
}

async function runMainProcess(platform = 'wol', doSitter = false, spells = []) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting login at:', new Date().toLocaleString());

  await context.tracing.start({ screenshots: true, snapshots: true });

  // Login to throne page for Hourly GC Bonus
  await doLogin(page, platform);

  // Cast self-spells as needed
  await checkAndCastSpells(page, platform, spells);

  // Repeat for sitter (if needed)
  if (doSitter) {
    console.log('-------------------------------------')
    console.log('Starting sitter login at:', new Date().toLocaleString());
    await page.goto(`https://utopia-game.com/${platform}/sit/game/throne`);
    await page.waitForLoadState('domcontentloaded');
    await page.$('#throne-monarch-message');

    await checkAndCastSpells(page, platform, spells, true);
  }

  await context.tracing.stop({ path: 'data/trace.zip' });

  await browser.close();

  console.log('-------------------------------------')
  console.log('Login(s) completed at:', new Date().toLocaleString());
}

function scheduleNextRun(platform, doSitter, spells) {
  const now = new Date();
  let totalDelay;

  if (platform === 'wol') {
    // Calculate the delay until the next hour and add a random delay of 1-20 minutes
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const randomDelay = Math.floor(Math.random() * 20 + 1) * 60 * 1000;
    totalDelay = nextHour.getTime() - now.getTime() + randomDelay;
  } else if (platform === 'gen') {
    // Calculate the delay until the next 15-minute interval and add a random delay of 1-4 minutes
    const nextQuarterHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
    const randomDelay = Math.floor(Math.random() * 4 + 1) * 60 * 1000;
    totalDelay = nextQuarterHour.getTime() - now.getTime() + randomDelay;
  }

  const nextRunTime = new Date(now.getTime() + totalDelay);
  const minutesUntilNextRun = totalDelay / 1000 / 60;

  console.log(`Next login scheduled at ${nextRunTime.toLocaleString()} (in ${minutesUntilNextRun.toFixed(2)} minutes)`);
  console.log('');

  // Schedule the next run
  setTimeout(() => {
    runMainProcess(platform, doSitter, spells).then(() => {
      scheduleNextRun(platform, doSitter, spells);
    });
  }, totalDelay);
}

// Main settings (maybe movee to .env?)
const platform = 'gen'; // Change this to 'gen' for Genesis
const doSitter = false; // Change this to false if sitter actions are not needed
const spells = ['MIND_FOCUS','LOVE_AND_PEACE','INSPIRE_ARMY']; // Change this to the spells you want to maintain

runMainProcess(platform, doSitter, spells).then(() => {
  scheduleNextRun(platform, doSitter, spells);
});
