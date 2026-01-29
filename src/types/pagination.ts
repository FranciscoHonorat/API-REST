import { env } from '../config/env';

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Valores das variáveis de ambiente
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = env.DEFAULT_PAGE_SIZE;
export const MAX_LIMIT = env.MAX_PAGE_SIZE;