import { ExpenseSchema } from "../../expense/model/expense";
import mongoose, { Schema } from "mongoose";
import { IncomeSchema } from "../../income/model/income";

export const WalletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expenses: [ExpenseSchema],
    incomes: [IncomeSchema],
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
      required: true,
    },
  },
  { collection: "wallets", timestamps: true }
);

export const Wallet =
  mongoose.models?.Wallet || mongoose.model("Wallet", WalletSchema);
