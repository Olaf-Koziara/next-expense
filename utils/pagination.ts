export const getPaginationFromUrl = (url: URL): { skip: number, pageSize: number } => {
    const skip = parseInt(url.searchParams.get('pageIndex') ?? '0');
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10');
    return {skip, pageSize};
}