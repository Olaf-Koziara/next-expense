export type ExpenseFilterParams = {
    category?: string;
    amountStart?: number;
    amountEnd?: number;
    title?: string;
    dateStart?: Date;
    dateEnd?: Date;
};

export const expenseFilterParamConfig: Record<string, {
    key: keyof ExpenseFilterParams,
    transform?: (value: string) => any,
    mongoOperator?: string
}> = {
    category: {
        key: 'category',
        mongoOperator: '$eq'
    },
    amountStart: {
        key: 'amountStart',
        transform: (value: string) => parseFloat(value) || 0,
        mongoOperator: '$gte'
    },
    amountEnd: {
        key: 'amountEnd',
        transform: (value: string) => {
            const val = parseFloat(value);
            return isNaN(val) ? Infinity : val;
        },
        mongoOperator: '$lte'
    },
    title: {
        key: 'title',
        mongoOperator: '$regex'
    },
    startDate: {
        key: 'dateStart',
        transform: (value: string) => new Date(value || '1970-01-01'),
        mongoOperator: '$gte'
    },
    endDate: {
        key: 'dateEnd',
        transform: (value: string) => new Date(value || '9999-12-31'),
        mongoOperator: '$lte'
    }
};
