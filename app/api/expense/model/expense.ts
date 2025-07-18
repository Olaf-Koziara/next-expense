import { Schema } from "mongoose";

export const ExpenseSchema = new Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be positive"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    default: Date.now,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  currency: {
    type: String,
    default: "USD",
  },
});
