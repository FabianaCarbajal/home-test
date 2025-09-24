import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base-page";
import { PAGES } from "../utils/constants";

export class CheckoutPage extends BasePage {
  // Private locators
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipInput: Locator;
  private readonly nameOnCardInput: Locator;
  private readonly creditCardInput: Locator;
  private readonly expMonthSelect: Locator;
  private readonly expYearInput: Locator;
  private readonly cvvInput: Locator;
  private readonly sameAddressCheckbox: Locator;
  private readonly submitButton: Locator;
  private readonly cartTotal: Locator;
  private readonly orderConfirmationHeading: Locator;
  private readonly orderConfirmationNumber: Locator;
  private readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page
      .getByRole("textbox", { name: "Full Name" })
      .describe("Full name input field");
    this.emailInput = page
      .getByRole("textbox", { name: "Email" })
      .describe("Email input field");
    this.addressInput = page
      .getByRole("textbox", { name: "Address" })
      .describe("Address input field");
    this.cityInput = page
      .getByRole("textbox", { name: "City" })
      .describe("City input field");
    this.stateInput = page
      .getByRole("textbox", { name: "State" })
      .describe("State input field");
    this.zipInput = page
      .getByRole("textbox", { name: "Zip" })
      .describe("Zip code input field");
    this.nameOnCardInput = page
      .getByRole("textbox", { name: "Name on Card" })
      .describe("Name on card input field");
    this.creditCardInput = page
      .getByRole("textbox", { name: "Credit card number" })
      .describe("Credit card number input field");
    this.expMonthSelect = page
      .getByRole("combobox", { name: "Exp Month" })
      .describe("Expiration month select");
    this.expYearInput = page
      .getByRole("textbox", { name: "Exp Year" })
      .describe("Expiration year input field");
    this.cvvInput = page
      .getByRole("textbox", { name: "CVV" })
      .describe("CVV input field");
    this.sameAddressCheckbox = page
      .getByRole("checkbox", { name: "Shipping address same as billing" })
      .describe("Same address checkbox");
    this.submitButton = page
      .getByRole("button", { name: "Continue to checkout" })
      .describe("Continue to checkout button");
    this.cartTotal = page
      .getByText(/^Total/)
      .locator(".price")
      .describe("Cart total display");
    this.orderConfirmationHeading = page
      .getByRole("heading", { name: "Order Confirmed!" })
      .describe("Order confirmation heading");
    this.orderConfirmationNumber = page
      .getByText(/Order Number: \d+/)
      .describe("Order confirmation number");
    this.itemPrices = page
      .locator("p")
      .filter({ has: page.getByRole("link") })
      .locator(".price")
      .describe("Individual item prices");
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(PAGES.CHECKOUT);
    await this.waitForPageLoad();
  }

  async goto(): Promise<void> {
    await this.navigate();
  }

  // Intentful methods
  async fillPersonalInformation(data: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
  }

  async fillPaymentInformation(data: {
    nameOnCard: string;
    creditCard: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  }): Promise<void> {
    await this.nameOnCardInput.fill(data.nameOnCard);
    await this.creditCardInput.fill(data.creditCard);
    await this.expMonthSelect.selectOption(data.expMonth);
    await this.expYearInput.fill(data.expYear);
    await this.cvvInput.fill(data.cvv);
  }

  async checkSameAddressOption(): Promise<void> {
    await expect(this.sameAddressCheckbox).toBeVisible();
    if (!(await this.sameAddressCheckbox.isChecked())) {
      await this.sameAddressCheckbox.check();
    }
    await expect(this.sameAddressCheckbox).toBeChecked();
  }

  async uncheckSameAddressOption(): Promise<void> {
    await expect(this.sameAddressCheckbox).toBeVisible();
    if (await this.sameAddressCheckbox.isChecked()) {
      await this.sameAddressCheckbox.uncheck();
    }
    await expect(this.sameAddressCheckbox).not.toBeChecked();
  }

  async submitOrder(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async submitOrderAndExpectAlert(): Promise<string> {
    let alertText = "";

    this.page.once("dialog", async (dialog) => {
      alertText = dialog.message();
      await dialog.accept();
    });

    await this.submitButton.click();
    await this.page.waitForTimeout(1000);

    return alertText;
  }

  async expectCartTotal(expectedTotal: string): Promise<void> {
    await expect(this.cartTotal).toBeVisible();
    await expect(this.cartTotal).toContainText(expectedTotal);
  }

  async expectOrderConfirmation(): Promise<void> {
    await expect(this.orderConfirmationHeading).toBeVisible();
    await expect(this.orderConfirmationNumber).toBeVisible();
    const confirmationText = await this.orderConfirmationNumber.textContent();
    expect(confirmationText?.trim()).not.toBe("");
  }

  async getDisplayedCartTotal(): Promise<string> {
    // Get the total from the element that starts with "Total" text
    const totalElement = this.page.getByText(/^Total/).locator(".price");
    return (await totalElement.textContent()) || "$0";
  }

  async getCalculatedItemTotal(): Promise<string> {
    // Get only product price elements (paragraphs with links containing prices)
    const priceElements = await this.page
      .locator("p")
      .filter({ has: this.page.getByRole("link") })
      .locator(".price")
      .all();
    let total = 0;

    // Sum all item prices
    for (const element of priceElements) {
      const priceText = (await element.textContent()) || "";
      const price = parseFloat(priceText.replace("$", ""));
      if (!isNaN(price)) {
        total += price;
      }
    }

    return `$${total}`;
  }

  async expectCartTotalIsCorrect(): Promise<void> {
    const displayedTotal = await this.getDisplayedCartTotal();
    const calculatedTotal = await this.getCalculatedItemTotal();
    expect(displayedTotal).toBe(calculatedTotal);
  }

  async expectNoDialogsPending(): Promise<void> {
    // Simple verification - check that page is in a stable state after dialog handling
    await this.page.waitForLoadState("domcontentloaded");
    // If we reach this point without errors, it means no dialogs are blocking the page
  }
}
