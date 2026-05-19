const { chromium } = require('playwright-extra');

export async function bypassCloudflareTest(url) {
  const browser = await chromium.launch({
    headless: false, // Start visible for debugging; set true later
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  // Persistent context helps maintain cookies/session
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    // Add proxy if needed: proxy: { server: 'http://user:pass@residential-proxy:port' }
  });

  const page = await context.newPage();

  // Optional: Randomize mouse movements and typing for more human-like behavior
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    console.log('Navigating to page...');
    await page.goto(url, {
      waitUntil: 'domcontentloaded', // Or 'networkidle' if needed
      timeout: 60000,
    });

    // Wait for potential Cloudflare challenge to resolve
    await page.waitForTimeout(5000); // Give time for JS challenges

    // Human-like interactions
    await page.mouse.move(100 + Math.random() * 200, 100 + Math.random() * 200, { steps: 20 });
    await page.waitForTimeout(1000 + Math.random() * 2000);

    // Check if we're past Cloudflare (look for your page content)
    const title = await page.title();
    console.log('Page title:', title);

    if (await page.locator('text=Cloudflare').count() > 0 || await page.locator('#challenge-form').count() > 0) {
      console.log('Still blocked by Cloudflare. Try proxies or CAPTCHA solver.');
    } else {
      console.log('Successfully loaded the page!');
      // Add your test assertions here
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    return page; // Return the page for further actions in tests
    // await browser.close(); // Uncomment when done
  }
}