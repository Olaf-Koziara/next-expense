export type Dictionary<T = unknown> = Record<string, T>;
const range = (x: number) => Array.from({length: x + 1}, (_, i) => i);
export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};