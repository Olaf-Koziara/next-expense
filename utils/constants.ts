export const APP_CONSTANTS = {
  DEFAULT_CURRENCY: "USD",
  DEFAULT_WALLET_NAME: "Default",
  DEFAULT_BALANCE: 0,
  MAX_TITLE_LENGTH: 100,
  MAX_NAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const TRANSACTION_TYPES = {
  EXPENSE: "expense",
  INCOME: "income",
} as const;

export const CURRENCIES = {
  USD: "USD",
  EUR: "EUR",
  PLN: "PLN",
  GBP: "GBP",
} as const;

export const DATE_FORMATS = {
  DISPLAY: "dd-MM-yyyy",
  ISO: "yyyy-MM-dd",
  FULL: "PPP",
} as const;

export const API_ENDPOINTS = {
  EXPENSES: "/api/expense",
  INCOMES: "/api/income",
  EXPENSE_CATEGORIES: "/api/expenseCategories",
  INCOME_CATEGORIES: "/api/incomeCategories",
  WALLETS: "/api/wallet",
  STATS: "/api/stats",
  USER: "/api/user",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Not found",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NETWORK_ERROR: "Network error",
  WALLET_NOT_SELECTED: "No wallet selected",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  WALLET_NOT_FOUND: "Wallet not found",
  CATEGORY_NOT_FOUND: "Category not found",
  TRANSACTION_NOT_FOUND: "Transaction not found",
} as const;

export const SUCCESS_MESSAGES = {
  WALLET_CREATED: "Wallet created successfully",
  WALLET_UPDATED: "Wallet updated successfully",
  WALLET_DELETED: "Wallet deleted successfully",
  TRANSACTION_CREATED: "Transaction created successfully",
  TRANSACTION_UPDATED: "Transaction updated successfully",
  TRANSACTION_DELETED: "Transaction deleted successfully",
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  USER_UPDATED: "User updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
} as const;
