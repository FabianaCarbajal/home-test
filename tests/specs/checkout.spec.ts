import { test, expect } from "../utils/test-base";
import { CheckoutPage } from "../pages";
import { TEST_DATA } from "../utils/constants";

test.describe("Checkout", () => {
  test("complete order with same address checked", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await test.step("Navigate to checkout page", async () => {
      await checkoutPage.navigate();
    });

    await test.step("Fill personal information", async () => {
      await checkoutPage.fillPersonalInformation({
        fullName: TEST_DATA.CHECKOUT_FORM.fullName,
        email: TEST_DATA.CHECKOUT_FORM.email,
        address: TEST_DATA.CHECKOUT_FORM.address,
        city: TEST_DATA.CHECKOUT_FORM.city,
        state: TEST_DATA.CHECKOUT_FORM.state,
        zip: TEST_DATA.CHECKOUT_FORM.zip,
      });
    });

    await test.step("Fill payment information", async () => {
      await checkoutPage.fillPaymentInformation({
        nameOnCard: TEST_DATA.CHECKOUT_FORM.nameOnCard,
        creditCard: TEST_DATA.CHECKOUT_FORM.creditCard,
        expMonth: TEST_DATA.CHECKOUT_FORM.expMonth,
        expYear: TEST_DATA.CHECKOUT_FORM.expYear,
        cvv: TEST_DATA.CHECKOUT_FORM.cvv,
      });
    });

    await test.step("Check same address option", async () => {
      await checkoutPage.checkSameAddressOption();
    });

    await test.step("Submit order", async () => {
      await checkoutPage.submitOrder();
    });

    await test.step("Assert form was submitted successfully", async () => {
      // Verificar que el formulario se envió exitosamente verificando que la página no muestre errores
      await expect(page).not.toHaveURL(/error/);
      // Verificar que se muestre la confirmación de la orden
      await checkoutPage.expectOrderConfirmation();
    });
  });

  test("show alert when same address unchecked", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await test.step("Navigate to checkout page", async () => {
      await checkoutPage.navigate();
    });

    await test.step("Fill personal information", async () => {
      await checkoutPage.fillPersonalInformation({
        fullName: TEST_DATA.CHECKOUT_FORM.fullName,
        email: TEST_DATA.CHECKOUT_FORM.email,
        address: TEST_DATA.CHECKOUT_FORM.address,
        city: TEST_DATA.CHECKOUT_FORM.city,
        state: TEST_DATA.CHECKOUT_FORM.state,
        zip: TEST_DATA.CHECKOUT_FORM.zip,
      });
    });

    await test.step("Fill payment information", async () => {
      await checkoutPage.fillPaymentInformation({
        nameOnCard: TEST_DATA.CHECKOUT_FORM.nameOnCard,
        creditCard: TEST_DATA.CHECKOUT_FORM.creditCard,
        expMonth: TEST_DATA.CHECKOUT_FORM.expMonth,
        expYear: TEST_DATA.CHECKOUT_FORM.expYear,
        cvv: TEST_DATA.CHECKOUT_FORM.cvv,
      });
    });

    await test.step("Uncheck same address option", async () => {
      await checkoutPage.uncheckSameAddressOption();
    });

    await test.step("Assert alert is shown on submit", async () => {
      const alertText = await checkoutPage.submitOrderAndExpectAlert();
      expect(alertText).toBeTruthy();
    });

    await test.step("Assert alert is gone", async () => {
      await checkoutPage.expectNoDialogsPending();
    });
  });

  test("verify cart total calculation", async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await test.step("Navigate to checkout page", async () => {
      await checkoutPage.navigate();
    });

    await test.step("Assert cart total is correct", async () => {
      await checkoutPage.expectCartTotalIsCorrect();
      const displayedTotal = await checkoutPage.getDisplayedCartTotal();
      const calculatedTotal = await checkoutPage.getCalculatedItemTotal();
      expect(displayedTotal).toBe(calculatedTotal);
    });
  });
});
