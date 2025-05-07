import { Service } from '@/types/Service';

export function useItemRemove<TData extends { _id: string }>(
    service: Service<TData>,
    dataParentId?: string | null,
    onRemoveComplete?: () => void
) {
    const handleItemRemove = async (item: TData) => {
        try {
            if (dataParentId) {
                await service.remove(item._id, dataParentId);
            } else {
                await service.remove(item._id);
            }
            onRemoveComplete?.();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return { handleItemRemove };
} 