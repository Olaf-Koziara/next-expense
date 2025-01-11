import mongoose, {Schema} from 'mongoose';


export const IncomeCategorySchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
    }, {collection: 'expenseCategories', timestamps: true}
);

export const IncomeCategory = mongoose.models?.IncomeCategory || mongoose.model('IncomeCategory', IncomeCategorySchema);