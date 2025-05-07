import { useState, useEffect } from 'react';
import { PaginationState, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { Service, ResponseWithArray } from '@/types/Service';
import { generateFilterObject } from '../utils';

export function useDataTable<TData extends { _id: string }>(
    service: Service<TData>,
    dataParentId?: string | null
) {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [data, setData] = useState<TData[]>([]);
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
    }, [sorting, columnFilters, pagination, dataParentId]);

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