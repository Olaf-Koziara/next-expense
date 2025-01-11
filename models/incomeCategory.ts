import mongoose, {Schema, Document} from 'mongoose';

export interface IIncomeCategory extends Document {
    name: string;
}

export const IncomeCategorySchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
        },
    }, {collection: 'expenseCategories', timestamps: true}
);

export const IncomeCategory = mongoose.models?.IncomeCategory || mongoose.model('IncomeCategory', IncomeCategorySchema);