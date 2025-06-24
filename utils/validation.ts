import { z } from "zod";

export const commonValidations = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  email: "Invalid email format",
  positiveNumber: (field: string) => `${field} must be a positive number`,
  futureDate: (field: string) => `${field} cannot be in the future`,
  pastDate: (field: string) => `${field} cannot be in the past`,
};

export const transactionSchema = z.object({
  title: z
    .string()
    .min(1, commonValidations.required("Title"))
    .max(100, commonValidations.maxLength("Title", 100)),
  amount: z.coerce
    .number()
    .positive(commonValidations.positiveNumber("Amount")),
  category: z.string().min(1, commonValidations.required("Category")),
  date: z
    .date()
    .refine((date) => date <= new Date(), commonValidations.futureDate("Date")),
  currency: z.string().min(1, commonValidations.required("Currency")),
});

export const walletSchema = z.object({
  name: z
    .string()
    .min(1, commonValidations.required("Wallet name"))
    .max(50, commonValidations.maxLength("Wallet name", 50)),
  balance: z.number().min(0, "Balance cannot be negative"),
  currency: z.string().min(1, commonValidations.required("Currency")),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, commonValidations.required("Category name"))
    .max(50, commonValidations.maxLength("Category name", 50)),
});

export const userSchema = z.object({
  name: z
    .string()
    .min(1, commonValidations.required("Name"))
    .max(100, commonValidations.maxLength("Name", 100)),
  email: z
    .string()
    .email(commonValidations.email)
    .min(1, commonValidations.required("Email")),
  password: z
    .string()
    .min(8, commonValidations.minLength("Password", 8))
    .max(100, commonValidations.maxLength("Password", 100)),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type WalletFormData = z.infer<typeof walletSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type UserFormData = z.infer<typeof userSchema>;
