import { test, expect } from "../utils/test-base";
import { SearchPage } from "../pages";
import { TEST_DATA } from "../utils/constants";

test.describe("Search", () => {
  test("show found result for valid term", async ({ page }) => {
    const searchPage = new SearchPage(page);

    await test.step("Navigate to search page", async () => {
      await searchPage.navigate();
    });

    await test.step("Search for valid term", async () => {
      await searchPage.searchFor(TEST_DATA.SEARCH_TERMS.VALID);
    });

    await test.step("Assert search success message", async () => {
      await searchPage.expectSearchSuccess(TEST_DATA.SEARCH_TERMS.VALID);
      const searchMessage = await searchPage.getSearchMessage();
      expect(searchMessage).toContain(
        `Found one result for ${TEST_DATA.SEARCH_TERMS.VALID}`
      );
    });
  });

  test("show error for empty search", async ({ page }) => {
    const searchPage = new SearchPage(page);

    await test.step("Navigate to search page", async () => {
      await searchPage.navigate();
    });

    await test.step("Submit empty search", async () => {
      await searchPage.searchWithEmptyTerm();
    });

    await test.step("Assert empty search error", async () => {
      await searchPage.expectEmptySearchError();
      const searchMessage = await searchPage.getSearchMessage();
      expect(searchMessage).toContain("Please provide a search word.");
    });
  });
});
