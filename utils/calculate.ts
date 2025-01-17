import {Expense} from "@/types/Expense";
import {Income} from "@/types/Income";
import {CategoryTotal} from "@/types/Stats";

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