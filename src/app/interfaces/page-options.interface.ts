export interface IPageOptions {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    skip: number;
    first?: boolean;
    last?: boolean;
}
