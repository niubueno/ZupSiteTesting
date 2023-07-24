const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }, testInfo) => {
    const header = new Map();
    header.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    page.setExtraHTTPHeaders(header);
    await page.goto("https://www.zup.com.br");
});

test("navigating to the home page", async ({ page }) => {
    await expect(page).toHaveURL("https://www.zup.com.br/");
});

test("Trying to recognize new tab opened", async ({ page }) => {
    await expect(page).toHaveURL("https://www.zup.com.br/");
    const context = page.context();

    const [stackSpotPage] = await Promise.all([
        context.waitForEvent("page"), // get `context` by destructuring with `page` in the test params; 'page' is a built-in event, and **you must wait for this like this,**, or `stackSpotPage` will just be the response object, rather than an actual Playwright page object.
        page.locator("text=Conheça StackSpot").click(), // note that, like all waiting in Playwright, this is somewhat unintuitive. This is the action which is *causing the navigation*; you have to set up the wait *before* it happens, hence the use of Promise.all().
    ]);

    await stackSpotPage.waitForLoadState(); // wait for the new tab to fully load
    // now, use `stackSpotPage` to access the newly opened tab, rather than `page`, which will still refer to the original page/tab.
    await expect(stackSpotPage).toHaveURL("stackspot.com/en?homezuppt=");
    await stackSpotPage.locator(
        "text=Otimize custos com a StackSpot Cloud Services"
    );
});

test("navigating to google", async ({ page }) => {
    await page.goto("https://www.google.com.br/");
    await expect(page.getByRole("img", { name: "Google" })).toBeVisible();
});
