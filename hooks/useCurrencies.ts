'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/services/api';

export type Currency = {
    currencyCode: string;
    currencyName: string;
    countryCode: string;
    countryName: string;
    status: string;
    availableFrom: string;
    availableUntil: string;
    icon: string;
};

export const useCurrencies = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
       
        if(currencies.length > 0) return;
        const fetchCurrencies = async () => {
            try {
                const response = await api.GET<{ supportedCurrenciesMap: Record<string, Currency> }>(
                    'https://api.currencyfreaks.com/v2.0/supported-currencies'
                );

                // Filter out crypto currencies and convert to array
                const filteredCurrencies = Object.values(response.supportedCurrenciesMap)
                    .filter(currency => currency.countryCode !== 'Crypto');

                
                    setCurrencies(filteredCurrencies);
                    setLoading(false);
                
            } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch currencies');
                    setLoading(false);
                
            }
        };

        fetchCurrencies();

      
    }, []);

    return { currencies, loading, error };
}; 