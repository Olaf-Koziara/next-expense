import mongoose, {Schema, Document} from 'mongoose';

export interface IExpenseCategory extends Document {
    name: string;
}

export const ExpenseCategorySchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
        },
    }, {collection: 'expenseCategories', timestamps: true}
);

export const ExpenseCategory = mongoose.models?.ExpenseCategory || mongoose.model('ExpenseCategory', ExpenseCategorySchema);