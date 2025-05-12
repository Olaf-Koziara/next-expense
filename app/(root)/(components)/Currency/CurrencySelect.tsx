'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface CurrencySelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export const CurrencySelect = ({ value, onValueChange, className }: CurrencySelectProps) => {
    const { currencies, loading, error } = useCurrency();

    const handleValueChange = useCallback((newValue: string) => {
        onValueChange(newValue);
    }, [onValueChange]);

    if (loading) return <div className="h-10 w-[120px] bg-muted animate-pulse rounded-md" />;
    if (error) return <div className="text-red-500 text-sm">Error loading currencies</div>;

    return (
        <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
                {currencies.map((currency) => (
                    <SelectItem 
                        key={`${currency.currencyCode}-${currency.countryCode}`} 
                        value={currency.currencyCode}
                    >
                        {currency.currencyCode} - {currency.currencyName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}; 