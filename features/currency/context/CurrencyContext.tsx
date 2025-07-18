'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useCurrencies } from '@/features/currency/hooks/useCurrencies';
import { Currency } from '@/features/currency/hooks/useCurrencies';

type CurrencyContextType = {
    currencies: Currency[];
    loading: boolean;
    error: Error | null;
};

const defaultContext: CurrencyContextType = {
    currencies: [],
    loading: true,
    error: null,
};

const CurrencyContext = createContext<CurrencyContextType>(defaultContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const { currencies, loading, error } = useCurrencies();
    const [currencyData, setCurrencyData] = useState<CurrencyContextType>({
        currencies,
        loading,
        error,
    });

    useEffect(() => {
        setCurrencyData({ currencies, loading, error });
    }, [currencies, loading, error]);

    return (
        <CurrencyContext.Provider value={currencyData}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}; 