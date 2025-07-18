export interface Currency {
    code: string;
    name: string;
}

export interface CurrencyResponse {
    currencySymbols: {
        [key: string]: string;
    };
} 