import {ColumnFiltersState, PaginationState, SortingState} from "@tanstack/react-table";
import {QueryParams} from "@/app/services/api";

export const generateFilterObject = (columnFilter: ColumnFiltersState, sortingState: SortingState, paginationState: PaginationState) => {
    const filterObject: QueryParams = {};
    for (let x = 0; x < columnFilter.length; x++) {
        const item = columnFilter[x];
        const key = columnFilter[x].id;
        const value = String(item.value)
        if (value.includes(',')) {
            const splittedValue = value.split(',');
            filterObject[`${key}Start`] = splittedValue[0];
            if (splittedValue[1]) {
                filterObject[`${key}End`] = splittedValue[1];
            }
        } else {
            filterObject[key] = value;
        }
    }
    for (let x = 0; x < sortingState.length; x++) {
        const item = sortingState[x];
        filterObject['sortBy'] = item.id;
        filterObject['sortOrder'] = item.desc ? 'desc' : 'asc'
    }
    filterObject['pageIndex'] = paginationState.pageIndex.toString();
    filterObject['pageSize'] = paginationState.pageSize.toString();
    return filterObject;

}
