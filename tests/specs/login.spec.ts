import { test, expect } from "../utils/test-base";
import { LoginPage } from "../pages";
import { CREDENTIALS } from "../utils/constants";

test.describe("Login", () => {
  test("add valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Navigate to login page", async () => {
      await loginPage.navigate();
    });

    await test.step("Login with valid credentials", async () => {
      await loginPage.loginAs(
        CREDENTIALS.VALID.USERNAME,
        CREDENTIALS.VALID.PASSWORD
      );
    });

    await test.step("Assert successful login", async () => {
      await loginPage.expectSuccessfulLogin(CREDENTIALS.VALID.USERNAME);
    });
  });

  test("show error with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Navigate to login page", async () => {
      await loginPage.navigate();
    });

    await test.step("Login with invalid credentials", async () => {
      await loginPage.loginAs(
        CREDENTIALS.INVALID.USERNAME,
        CREDENTIALS.INVALID.PASSWORD
      );
    });

    await test.step("Assert error message is shown", async () => {
      await loginPage.expectWrongCredentialsError();
    });
  });

  test("show error with empty credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Navigate to login page", async () => {
      await loginPage.navigate();
    });

    await test.step("Submit form with empty credentials", async () => {
      await loginPage.loginWithEmptyCredentials();
    });

    await test.step("Assert error message is shown", async () => {
      await loginPage.expectEmptyFieldsError();
    });
  });
});
