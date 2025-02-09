import {TransactionType} from "@/types/Expense";

export type ExpenseFilterParams = {
    category?: string;
    amountStart?: number;
    amountEnd?: number;
    title?: string;
    dateStart?: Date;
    dateEnd?: Date;
};

interface MongoQuery {
    $regex?: string;
    $options?: string;
    $gte?: string | number | Date;
    $lte?: string | number | Date;

    [operator: string]: unknown;
}

export const expenseFilterParamConfig: Record<string, {
    key: keyof ExpenseFilterParams,
    transform?: (value: string) => number | string | Date,
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
    dateStart: {
        key: 'dateStart',
        transform: (value: string) => new Date(value || '1970-01-01'),
        mongoOperator: '$gte'
    },
    dateEnd: {
        key: 'dateEnd',
        transform: (value: string) => new Date(value || '9999-12-31'),
        mongoOperator: '$lte'
    }
};
export const getFilterMatchStageFromUrl = (url: URL, type: TransactionType = 'expense') => {
    const matchStage: Record<string, MongoQuery> = {};
    for (const [param, config] of Object.entries(expenseFilterParamConfig)) {
        const value = url.searchParams.get(param);
        if (value) {
            const transformedValue = config.transform ? config.transform(value) : value;

            if (param === 'title') {
                matchStage[`${type}s.title`] = {
                    $regex: transformedValue as string,
                    $options: 'i'
                };
            } else if (param === 'dateStart' || param === 'dateEnd') {
                matchStage[`${type}s.date`] = matchStage[`${type}s.date`] || {};
                matchStage[`${type}s.date`][config.mongoOperator!] = transformedValue;
            } else if (param === 'amountStart' || param === 'amountEnd') {
                matchStage[`${type}s.amount`] = matchStage[`${type}s.amount`] || {};
                matchStage[`${type}s.amount`][config.mongoOperator!] = transformedValue;
            } else {
                matchStage[`${type}s.${param}`] = {
                    [config.mongoOperator!]: transformedValue
                };
            }
        }
    }

    return matchStage;
}

