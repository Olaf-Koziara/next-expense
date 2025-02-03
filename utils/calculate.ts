import {Expense} from "@/types/Expense";
import {Income} from "@/types/Income";
import {CategoryDateTotal, CategoryTotal} from "@/types/Stats";

export const getCategoryWithBiggestSum = (expenses: Expense[] | Income[]): CategoryTotal => {
    const categorySums: { [key: string]: number } = {};

    expenses.forEach(expense => {
        if (!categorySums[expense.category]) {
            categorySums[expense.category] = 0;
        }
        categorySums[expense.category] += expense.amount;
    });

    let maxCategory = '';
    let maxTotal = 0;

    for (const category in categorySums) {
        if (categorySums[category] > maxTotal) {
            maxTotal = categorySums[category];
            maxCategory = category;
        }
    }

    return {category: maxCategory, total: maxTotal};
};
export const sumByKey = <T>(items: T[], key: keyof T, keyName: keyof T): {
    keyName: keyof T,
    keyValue: string,
    total: number
}[] => {
    const keySums: { [key: string]: number } = {};

    items.forEach(item => {
        const keyValue = item[keyName] as unknown as string;
        if (!keySums[keyValue]) {
            keySums[keyValue] = 0;
        }
        keySums[keyValue] += item[key] as unknown as number;
    });

    return Object.keys(keySums).map(keyValue => ({
        keyName,
        keyValue,
        total: keySums[keyValue]
    }));
};
type Item = {
    [key: string]: any;
};

export const sumByKeys = (items: Item[], keys: string[], valueKey: string): Item[] => {
    const result: { [key: string]: number } = {};

    items.forEach(item => {
        const compositeKey = keys.map(key => item[key]).join('|');
        if (!result[compositeKey]) {
            result[compositeKey] = 0;
        }
        result[compositeKey] += item[valueKey];
    });

    return Object.keys(result).map(compositeKey => {
        const keyValues = compositeKey.split('|');
        const obj: Item = {};
        keys.forEach((key, index) => {
            obj[key] = keyValues[index];
        });
        obj[valueKey] = result[compositeKey];
        return obj;
    });
};


export const getHighestByKey = <T>(items: T[], key: keyof T): T | null => {
    let highest: T | null = null;
    items.forEach(item => {
        if (!highest) {
            highest = item;
        } else {
            if (item[key] > highest[key]) {
                highest = item
            }
        }

    })
    return highest;
}
export const prepareExpenseDataForAreaChart = (expenses: CategoryDateTotal[]) => {
    // Group and sum expenses by date and category
    const groupedExpenses = sumByKeys(expenses, ['date', 'category'], 'amount');

    // Transform the grouped data into the desired format
    const dataByDate: { [date: string]: { [category: string]: number } } = {};

    groupedExpenses.forEach(item => {
        const date = item.date;
        const category = item.category;
        const amount = item.amount;

        if (!dataByDate[date]) {
            dataByDate[date] = {date};
        }

        dataByDate[date][category] = amount;
    });

    // Convert the dataByDate object into an array
    const transformedData = Object.values(dataByDate);

    return transformedData;
};