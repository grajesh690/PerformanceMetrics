import { chromium, test } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";
import lighthouseDesktopConfig from "lighthouse/lighthouse-core/config/lr-desktop-config";
import { inputUrl } from "../data/url.json";


inputUrl.forEach((data) => {
  test(`Performances Test ${data}`, async () => {
    const browser = await chromium.launch({
      args: [`--remote-debugging-port=9222`],
    });
    const page = await browser.newPage();
    console.log(data);
    await page.goto(data);
    await page.waitForLoadState("networkidle");
    await playAudit({
      page: page,
      config: lighthouseDesktopConfig,
      thresholds: {
        performance: 50,
        accessibility: 50,
        "best-practices": 50,
        seo: 50,
      },
      port: 9222,
      reports: {
        formats: {
          // json: true,
          html: true,
        },
        name: `audit_${data.replace("https://", "")}`,
      },
    });

    await browser.close();
  });
});