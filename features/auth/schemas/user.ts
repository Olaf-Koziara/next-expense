import mongoose, {Schema} from "mongoose";
export interface IUser {
    email: string;
    name: string;
    password?: string;
    expenseCategories: mongoose.Types.ObjectId[];
    incomeCategories: mongoose.Types.ObjectId[];
    wallets: mongoose.Types.ObjectId[];
}
const UserSchema = new Schema<IUser>({
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
        required: false,
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