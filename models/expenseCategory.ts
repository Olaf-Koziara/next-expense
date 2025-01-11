import mongoose, {Schema} from 'mongoose';


export const ExpenseCategorySchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,

        },
    }, {collection: 'expenseCategories', timestamps: true}
);

export const ExpenseCategory = mongoose.models?.ExpenseCategory || mongoose.model('ExpenseCategory', ExpenseCategorySchema);