export const BASE_URL = process.env.BASE_URL || "http://localhost:3100";

export const PAGES = {
  LOGIN: "/login",
  CHECKOUT: "/checkout",
  GRID: "/grid",
  SEARCH: "/search",
} as const;

export const CREDENTIALS = {
  VALID: {
    USERNAME: "johndoe19",
    PASSWORD: "supersecret",
  },
  INVALID: {
    USERNAME: "wronguser",
    PASSWORD: "wrongpass",
  },
};

export const TIMEOUTS = {
  DEFAULT: 5000,
  LONG: 10000,
  SHORT: 1000,
} as const;

export const TEST_DATA = {
  CHECKOUT_FORM: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    nameOnCard: "John Doe",
    creditCard: "4111111111111111",
    expMonth: "January",
    expYear: "2025",
    cvv: "123",
  },
  SEARCH_TERMS: {
    VALID: "automation",
    EMPTY: "",
  },
} as const;
