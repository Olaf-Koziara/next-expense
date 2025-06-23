import { useState, useEffect } from "react";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Service, ResponseWithArray } from "@/types/Service";
import { generateFilterObject } from "../utils";

type UseDataTableOptions = {
  initialData?: unknown[];
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  initialPageSize?: number;
  externalData?: unknown[];
  refetchTrigger?: boolean;
};

export function useDataTable<TData extends { _id: string }>(
  service: Service<TData>,
  dataParentId?: string | null,
  options?: UseDataTableOptions
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options?.initialPageSize ?? 10,
  });
  const [sorting, setSorting] = useState<SortingState>(
    options?.initialSorting ?? []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    options?.initialFilters ?? []
  );
  const [data, setData] = useState<TData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filter = generateFilterObject(columnFilters, sorting, pagination);
      let response: ResponseWithArray<TData>;
      console.log("fetching data", filter, dataParentId);
      if (dataParentId) {
        response = await service.getAll(filter, dataParentId);
      } else {
        response = await service.getAll(filter);
      }

      setData(response.data);
      setPageCount(Math.ceil(response.totalCount / pagination.pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 100); // 100ms debounce, adjust as needed

    return () => clearTimeout(handler);
  }, [
    service,
    sorting,
    columnFilters,
    pagination,
    dataParentId,
    options?.refetchTrigger,
  ]);

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
    fetchData,
  };
}
