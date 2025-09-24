import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base-page";
import { PAGES } from "../utils/constants";

export class LoginPage extends BasePage {
  // Private locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly wrongCredentialsError: Locator;
  private readonly emptyFieldsError: Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page
      .getByRole("textbox", { name: "USERNAME" })
      .describe("Username input field");
    this.passwordInput = page
      .getByRole("textbox", { name: "PASSWORD" })
      .describe("Password input field");
    this.loginButton = page
      .getByRole("button", { name: "Sign In" })
      .describe("Login button");
    this.wrongCredentialsError = page
      .getByRole("heading", { name: "Wrong credentials" })
      .describe("Wrong credentials error message");
    this.emptyFieldsError = page
      .getByRole("heading", { name: "Fields can not be empty" })
      .describe("Empty fields error message");
    this.welcomeMessage = page
      .getByRole("heading", { name: "Welcome!" })
      .describe("Welcome message heading");
  }

  // Navigation
  async navigate(): Promise<void> {
    await this.page.goto(PAGES.LOGIN);
    await this.waitForPageLoad();
  }

  async goto(): Promise<void> {
    await this.navigate();
  }

  // Intentful methods
  async loginAs(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation or error
    await this.page.waitForLoadState("networkidle");
  }

  async loginWithEmptyCredentials(): Promise<void> {
    await this.usernameInput.fill("");
    await this.passwordInput.fill("");
    await this.loginButton.click();
    await expect(this.emptyFieldsError).toBeVisible();
  }

  async expectSuccessfulLogin(expectedUsername: string): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/home/);
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.page.getByText(expectedUsername)).toBeVisible();
  }

  async expectWrongCredentialsError(): Promise<void> {
    await expect(this.wrongCredentialsError).toBeVisible();
  }

  async expectEmptyFieldsError(): Promise<void> {
    await expect(this.emptyFieldsError).toBeVisible();
  }

  async getWrongCredentialsErrorMessage(): Promise<string> {
    await expect(this.wrongCredentialsError).toBeVisible();
    return (await this.wrongCredentialsError.textContent()) || "";
  }

  async getEmptyFieldsErrorMessage(): Promise<string> {
    await expect(this.emptyFieldsError).toBeVisible();
    return (await this.emptyFieldsError.textContent()) || "";
  }

  async getWelcomeMessage(): Promise<string> {
    await expect(this.welcomeMessage).toBeVisible();
    return (await this.welcomeMessage.textContent()) || "";
  }
}
