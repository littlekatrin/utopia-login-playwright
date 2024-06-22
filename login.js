const { test, expect, chromium } = require('@playwright/test');
require('dotenv').config();

async function castSpell(page, spell, sitter = false) {
  if (sitter) {
    await page.goto('https://utopia-game.com/wol/sit/game/enchantment');
  } else {
    await page.goto('https://utopia-game.com/wol/game/enchantment');
  }
  await page.selectOption('#id_self_spell', spell);
  await page.click('input.button[type="submit"]');
}

async function checkAndCastSpells(page, spell) {
  const spans = await page.$$('span.good');
  let needsRefresh = true;
  let spellName = '';

  // Check active self spells for the desired spell
  for (const span of spans) {
    const textContent = await span.textContent();
    spellName = textContent.trim();
    let currentSpell = textContent.trim().toUpperCase().replace(/ /g, '_');
    
    if (currentSpell === spell) {
      console.log(`Found ${spellName}`);
      const nextSibling = await span.evaluate(node => node.nextSibling.textContent.trim());
      if (nextSibling.includes("(-)")) {
        console.log(`Duration of ${spellName} is (-), refreshing...`);
        needsRefresh = true;
      } else {
        console.log(`${spellName} is active for ${nextSibling}`);
        needsRefresh = false;
      }
      break;
    }
  }

  if (needsRefresh) {
    await castSpell(page, spell);
    console.log(`${spellName} cast!`);
  }
}

async function runLoginTest(doSitter, spell) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting login at:', new Date().toLocaleString());

  await context.tracing.start({ screenshots: true, snapshots: true });

  // Login to throne page for Hourly GC Bonus
  await page.goto('https://utopia-game.com/shared/?next=/wol/game/throne');
  await page.fill('#id_username', process.env.UTO_USERNAME);
  await page.fill('#id_password', process.env.UTO_PASSWORD);
  await page.click('.g-recaptcha');
  await page.waitForLoadState('domcontentloaded');
  const royalCommand = await page.$('#throne-monarch-message');
  expect(royalCommand).not.toBeNull();

  // Cast self-spells as needed
  await checkAndCastSpells(page, spell);

  // Repeat for sitter if needed
  if (doSitter) {
    console.log('-------------------------------------')
    console.log('Starting sitter login at:', new Date().toLocaleString());
    await page.goto('https://utopia-game.com/wol/sit/game/throne');
    await page.waitForLoadState('domcontentloaded');
    const royalCommand2 = await page.$('#throne-monarch-message');
    expect(royalCommand2).not.toBeNull();

    await checkAndCastSpells(page, spell, true);
  }

  await context.tracing.stop({ path: 'data/trace.zip' });

  await browser.close();

  console.log('-------------------------------------')
  console.log('Login(s) completed at:', new Date().toLocaleString());
}

function scheduleNextRun(doSitter, spell) {
  // Calculate the delay until the next hour and add a random delay of 1-20 minutes
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
  const randomDelay = Math.floor(Math.random() * 20 + 1) * 60 * 1000;
  const totalDelay = nextHour.getTime() - now.getTime() + randomDelay;

  const nextRunTime = new Date(now.getTime() + totalDelay);
  const minutesUntilNextRun = totalDelay / 1000 / 60;

  console.log(`Next login scheduled at ${nextRunTime.toLocaleString()} (in ${minutesUntilNextRun.toFixed(2)} minutes)`);
  console.log('');

  // Schedule the next run
  setTimeout(() => {
    runLoginTest(doSitter, spell).then(() => {
      scheduleNextRun(doSitter, spell); // Schedule the subsequent run
    });
  }, totalDelay);
}

// Main
const doSitter = true; // Change this to false if sitter actions are not needed
const spell = 'FOUNTAIN_OF_KNOWLEDGE'; // Change this to the spell you want to cast

runLoginTest(doSitter, spell).then(() => {
  scheduleNextRun(doSitter, spell);
});
