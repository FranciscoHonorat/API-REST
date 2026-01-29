import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
});

export const studentQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    sortBy: z.enum(['id', 'name', 'email', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional()
});

export const courseQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    name: z.string().optional(),
    instructor: z.string().optional(),
    duration: z.coerce.number().int().positive().optional(),
    sortBy: z.enum(['id', 'name', 'instructor', 'duration', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional()
});

export const enrollmentQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    status: z.enum(['active', 'completed', 'cancelled']).optional(),
    studentId: z.coerce.number().int().positive().optional(),
    courseId: z.coerce.number().int().positive().optional(),
    sortBy: z.enum(['id', 'status', 'enrolledAt', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional()
});