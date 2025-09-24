import { test, expect } from "../utils/test-base";
import { GridPage } from "../pages";

test.describe("Grid", () => {
  test("verify product at position 7", async ({ page }) => {
    const gridPage = new GridPage(page);

    await test.step("Navigate to grid page", async () => {
      await gridPage.navigate();
    });

    await test.step("Assert item at position 7", async () => {
      await gridPage.expectProductAtPosition(7, "Super Pepperoni", "$10");
      const item = await gridPage.getItemAtPosition(7);
      expect(item.title).toContain("Super Pepperoni");
      expect(item.price).toContain("$10");
    });
  });

  test("verify all items have required elements", async ({ page }) => {
    const gridPage = new GridPage(page);

    await test.step("Navigate to grid page", async () => {
      await gridPage.navigate();
    });

    await test.step("Assert all items have required elements", async () => {
      await gridPage.expectAllItemsHaveRequiredElements();
      const items = await gridPage.getAllItems();

      for (const item of items) {
        expect(item.title.trim()).not.toBe("");
        expect(item.price.trim()).not.toBe("");
        expect(item.hasImage).toBe(true);
        expect(item.hasButton).toBe(true);
      }
    });
  });
});
