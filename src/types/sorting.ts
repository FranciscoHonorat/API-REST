export type SortOrder = 'asc' | 'desc';

export interface SortParams {
    sortBy?: string;
    order?: SortOrder;
}

// Campos permitidos para ordenação (baseado no schema Prisma)
export const STUDENT_SORTABLE_FIELDS = ['id', 'name', 'email', 'createdAt'];
export const COURSE_SORTABLE_FIELDS = ['id', 'name', 'instructor', 'duration', 'createdAt'];
export const ENROLLMENT_SORTABLE_FIELDS = ['id', 'status', 'enrolledAt', 'createdAt'];