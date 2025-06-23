export const getPaginationFromUrl = (url: URL): { skip: number, pageSize: number } => {
    const pageIndex = parseInt(url.searchParams.get('pageIndex') ?? '0');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10');
    const skip = pageIndex * pageSize;
    return {skip, pageSize};
}