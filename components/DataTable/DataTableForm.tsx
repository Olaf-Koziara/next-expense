'use client';

import React, { useState } from 'react';
import { Service } from '@/types/Service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import DataTableEditField from './DataTableEditField';
import { Schema } from './DataTable';
import { useWallet } from '@/context/WalletContext';

type Props<TData> = {
    service: Service<TData>;
    schema: Schema;
    dataParentId?: string | null;
    onSuccess?: () => void;
}

export function DataTableForm<TData>({ service, schema, dataParentId, onSuccess }: Props<TData>) {
    const [formData, setFormData] = useState<Partial<TData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const { triggerRefetch } = useWallet();

    const handleInputChange = (key: string, value: TData[keyof TData]) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await service.add(formData as TData, dataParentId);
            setFormData({});
            triggerRefetch();
            onSuccess?.();
        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Item
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(schema).map(([key, field]) => (
                            field.editable && (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{field.label}</Label>
                                <DataTableEditField
                                    column={{columnDef:{
                                        id: key,
                                        meta: {
                                            fieldVariant: field.type,
                                            filterOptions: field.options
                                        }
                                    }}}
                                    value={formData[key as keyof TData]}
                                    onChange={(value) => handleInputChange(key, value)}
                                />
                            </div>
                        )))}
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Item'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
