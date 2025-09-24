import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base-page";
import { PAGES } from "../utils/constants";

export class GridPage extends BasePage {
  // Private locators
  private readonly gridItems: Locator;
  private readonly itemTitles: Locator;
  private readonly itemPrices: Locator;
  private readonly itemImages: Locator;
  private readonly itemButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.gridItems = page
      .locator("generic")
      .filter({ has: page.locator("img") })
      .describe("Product grid items");
    this.itemTitles = page
      .getByRole("heading", { level: 4 })
      .describe("Product titles");
    this.itemPrices = page.locator("#item-price").describe("Product prices");
    this.itemImages = page.getByRole("img").describe("Product images");
    this.itemButtons = page
      .getByRole("button", { name: "Add to Order" })
      .describe("Add to order buttons");
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(PAGES.GRID);
    await this.waitForPageLoad();
  }

  async goto(): Promise<void> {
    await this.navigate();
  }

  // Intentful methods
  async expectProductAtPosition(
    position: number,
    expectedTitle: string,
    expectedPrice: string
  ): Promise<void> {
    const item = await this.getItemAtPosition(position);
    expect(item.title.trim()).toBe(expectedTitle);
    expect(item.price.trim()).toBe(expectedPrice);
    expect(item.hasImage).toBe(true);
    expect(item.hasButton).toBe(true);
  }

  async expectAllItemsHaveRequiredElements(): Promise<void> {
    const items = await this.getAllItems();

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.title.trim()).not.toBe("");
      expect(item.price.trim()).not.toBe("");
      expect(item.hasImage).toBe(true);
      expect(item.hasButton).toBe(true);
    }
  }

  async addProductToOrder(position: number): Promise<void> {
    const button = this.itemButtons.nth(position - 1);
    await expect(button).toBeVisible();
    await button.click();
  }

  async getItemsCount(): Promise<number> {
    return await this.itemTitles.count();
  }

  async getItemAtPosition(position: number): Promise<{
    title: string;
    price: string;
    hasImage: boolean;
    hasButton: boolean;
  }> {
    // Position is 1-based, but arrays are 0-based
    const itemIndex = position - 1;

    const title = (await this.itemTitles.nth(itemIndex).textContent()) || "";
    const price = (await this.itemPrices.nth(itemIndex).textContent()) || "";
    const hasImage = await this.itemImages.nth(itemIndex).isVisible();
    const hasButton = await this.itemButtons.nth(itemIndex).isVisible();

    return { title, price, hasImage, hasButton };
  }

  async assertItemAtPosition(
    position: number,
    expectedTitle: string,
    expectedPrice: string
  ): Promise<void> {
    const item = await this.getItemAtPosition(position);

    expect(item.title.toLowerCase()).toContain(expectedTitle.toLowerCase());
    expect(item.price).toContain(expectedPrice);
  }

  async getAllItems(): Promise<
    Array<{
      title: string;
      price: string;
      hasImage: boolean;
      hasButton: boolean;
    }>
  > {
    const titleCount = await this.itemTitles.count();
    const items = [];

    for (let i = 0; i < titleCount; i++) {
      const title = (await this.itemTitles.nth(i).textContent()) || "";
      const price = (await this.itemPrices.nth(i).textContent()) || "";
      const hasImage = await this.itemImages.nth(i).isVisible();
      const hasButton = await this.itemButtons.nth(i).isVisible();

      items.push({ title, price, hasImage, hasButton });
    }

    return items;
  }

  async assertAllItemsHaveRequiredElements(): Promise<void> {
    const items = await this.getAllItems();

    for (const item of items) {
      expect(item.title.trim()).not.toBe("");
      expect(item.price.trim()).not.toBe("");
      expect(item.hasImage).toBe(true);
      expect(item.hasButton).toBe(true);
    }
  }

  async getGridItemsCount(): Promise<number> {
    return await this.itemTitles.count();
  }

  // Dynamic locator functions for better flexibility
  getProductByPosition = (position: number): Locator =>
    this.gridItems
      .nth(position - 1)
      .describe(`Product at position ${position}`);

  getProductTitle = (position: number): Locator =>
    this.itemTitles
      .nth(position - 1)
      .describe(`Product title at position ${position}`);

  getProductPrice = (position: number): Locator =>
    this.itemPrices
      .nth(position - 1)
      .describe(`Product price at position ${position}`);

  getProductButton = (position: number): Locator =>
    this.itemButtons
      .nth(position - 1)
      .describe(`Product button at position ${position}`);
}
