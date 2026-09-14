import puppeteer from "puppeteer";

const COUNT = Number(process.argv[2]) || 5;
const RUN_ID = Date.now().toString().slice(-6);

const signup = async (browser, username) => {
  const page = await browser.newPage();

  await page.goto("http://localhost:3000");

  await page.type("#usernameInput", username);
  await page.type("#passwordInput", "password123");
  await page.click("#signupBtn");

  await page.waitForSelector("#resultBox:not(.hidden)");

  const message = await page.evaluate(() => {
    const el = document.querySelector("#resultMessage");
    return el ? el.textContent.trim() : "No result message found";
  });

  await page.close();

  return message;
};

(async () => {
  const browser = await puppeteer.launch();

  for (let i = 1; i <= COUNT; i++) {
    const username = `demo_${RUN_ID}_${i}`;

    try {
      const message = await signup(browser, username);
      console.log(`[${i}/${COUNT}] ${username}: ${message}`);
    } catch (err) {
      console.error(`[${i}/${COUNT}] ${username} failed:`, err.message);
    }
  }

  await browser.close();
})().catch((err) => {
  console.error("Bot test failed:", err);
});