import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { Service } from '@/types/Service';

export function useRowEdit<TData extends { _id: string }>(
    service: Service<TData>,
    dataParentId?: string | null,
    onEditComplete?: () => void
) {
    const [rowInEditId, setRowEditId] = useState<string | null>(null);
    const [rowInEdit, setRowInEdit] = useState<TData>();

    const handleItemEdit = async (row: Row<TData>) => {
        setRowEditId(row.id);
        setRowInEdit(row.original);

        if (rowInEditId === row.id && rowInEdit) {
            try {
                if (dataParentId) {
                    await service.patch(rowInEdit, dataParentId);
                } else {
                    await service.patch(rowInEdit);
                }
                onEditComplete?.();
            } catch (error) {
                console.error('Error updating item:', error);
            }
            setRowEditId(null);
            setRowInEdit(undefined);
        }
    };

    const handleItemInputChange = (value: TData[keyof TData], columnId: string) => {
        setRowInEdit((prev) =>
            prev
                ? {
                    ...prev,
                    [columnId]: value,
                }
                : undefined
        );
    };

    return {
        rowInEditId,
        rowInEdit,
        handleItemEdit,
        handleItemInputChange
    };
} 