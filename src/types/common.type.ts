export type FindAllResponse<T> = { count: number; items: T[] };
export type PaginateParams = { page: number; limit: number };
export type SortParams = { [key: string]: 'ASC' | 'DESC' };
export type SearchParams = { [key: string]: string };
export type FindAllQueryParams = {
    paginate?: PaginateParams;
    sort?: SortParams;
    search?: SearchParams;
};
