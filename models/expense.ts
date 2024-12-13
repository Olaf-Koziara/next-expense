import {connectMongoDB} from "@/lib/mongodb";
import mongoose, {Schema} from "mongoose";
await connectMongoDB();
const ExpenseCategorySchema = new Schema({
    title:String
},{collection:'expense_categories'})
 const ExpenseSchema = new Schema({
    date:Date,
    title:String,
    amount:Number,
    category:String,
})
export const Expense = mongoose.models?.Expense || mongoose.model('Expense',ExpenseSchema)
export const ExpenseCategory = mongoose.models?.ExpenseCategory || mongoose.model('ExpenseCategory',ExpenseCategorySchema)