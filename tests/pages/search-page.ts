import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base-page";
import { PAGES } from "../utils/constants";

export class SearchPage extends BasePage {
  // Private locators
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchResults: Locator;
  private readonly searchMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page
      .getByPlaceholder("Search..")
      .describe("Search input field");
    this.searchButton = page
      .getByRole("button")
      .describe("Search submit button");
    this.searchResults = page
      .getByTestId("search-results")
      .describe("Search results container");
    this.searchMessage = page
      .getByText(/Found one result for|Please provide a search word/)
      .describe("Search result message");
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(PAGES.SEARCH);
    await this.waitForPageLoad();
  }

  async goto(): Promise<void> {
    await this.navigate();
  }

  // Intentful methods
  async searchFor(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async searchWithEmptyTerm(): Promise<void> {
    await this.searchInput.fill("");
    await this.searchButton.click();
    await expect(this.searchMessage).toBeVisible();
  }

  async expectSearchSuccess(searchTerm: string): Promise<void> {
    const expectedMessage = `Found one result for ${searchTerm}`;
    await expect(this.searchMessage).toBeVisible();
    await expect(this.searchMessage).toContainText(expectedMessage);
  }

  async expectEmptySearchError(): Promise<void> {
    const expectedMessage = "Please provide a search word.";
    await expect(this.searchMessage).toBeVisible();
    await expect(this.searchMessage).toContainText(expectedMessage);
  }

  async getSearchMessage(): Promise<string> {
    await expect(this.searchMessage).toBeVisible();
    return (await this.searchMessage.textContent()) || "";
  }

  async hasSearchResults(): Promise<boolean> {
    return await this.searchResults.isVisible();
  }
}
