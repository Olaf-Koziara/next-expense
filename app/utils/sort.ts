export type SortOrder = 'asc' | 'desc';
export const sortItems = <T, >(items: T[], sortBy: keyof T, order: SortOrder = 'asc'): T[] => {
    return items.sort((a, b) => {

        const valueA = a[sortBy] ? a[sortBy].toString().toLowerCase() : '';
        const valueB = b[sortBy] ? b[sortBy].toString().toLowerCase() : '';
        if (order === "asc") {
            return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
    });
};
export const getSortParamsFromUrl = (url: URL) => {
    const sortBy: string = url.searchParams.get("sortBy") ?? 'title';
    const orderParam = url.searchParams.get("sortOrder") ?? '';
    let sortOrder: SortOrder = orderParam === 'asc' || 'desc' ? orderParam as SortOrder : 'asc';
    return {
        sortOrder,
        sortBy
    }
}