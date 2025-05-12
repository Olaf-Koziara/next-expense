import { useState, useEffect } from 'react';
import { PaginationState, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { Service, ResponseWithArray } from '@/types/Service';
import { generateFilterObject } from '../utils';
import { useWallet } from '@/context/WalletContext';

type UseDataTableOptions = {
    initialData?: any[];
    initialSorting?: SortingState;
    initialFilters?: ColumnFiltersState;
    initialPageSize?: number;
    externalData?: any[];
    refetchTrigger?: boolean;
}

export function useDataTable<TData extends { _id: string }>(
    service: Service<TData>,
    dataParentId?: string | null,
    options?: UseDataTableOptions
) {
    const [pagination, setPagination] = useState<PaginationState>({ 
        pageIndex: 0, 
        pageSize: options?.initialPageSize ?? 10 
    });
    const [sorting, setSorting] = useState<SortingState>(options?.initialSorting ?? []);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(options?.initialFilters ?? []);
    const [data, setData] = useState<TData[]>(options?.initialData ?? []);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const filter = generateFilterObject(columnFilters, sorting, pagination);
            let response: ResponseWithArray<TData>;
            
            if (dataParentId) {
                response = await service.getAll(filter, dataParentId);
            } else {
                response = await service.getAll(filter);
            }
   
            setData(response.data);
            setPageCount(Math.ceil(response.totalCount / pagination.pageSize));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        fetchData();
    }, [sorting, columnFilters, pagination, dataParentId, service, options?.refetchTrigger]);

    return {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        fetchData
    };
} 