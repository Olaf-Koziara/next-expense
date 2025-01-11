import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
        ],
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    expenseCategories: [
        {type: Schema.Types.ObjectId, ref: 'ExpenseCategory'}
    ],
    incomeCategories: [
        {type: Schema.Types.ObjectId, ref: 'IncomeCategory'}
    ],
    wallets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        }

    ]

}, {collection: 'users'});

export const User = mongoose.models?.User || mongoose.model('User', UserSchema);