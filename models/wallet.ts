import mongoose, {Schema} from "mongoose";

const ExpenseSchema = new Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be positive"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
});
const IncomeSchema = new Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be positive"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
});
const WalletSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    expenses: [ExpenseSchema],
    incomes: [IncomeSchema],
    balance: {
        type: Number,
        default: 0
    }
}, {collection: 'wallets', timestamps: true});

export const Wallet = mongoose.models?.Wallet || mongoose.model('Wallet', WalletSchema);