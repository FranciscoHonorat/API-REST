import { z } from 'zod';

// Schemas de validação Zod (campos baseados no Prisma schema)

export const createEnrollmentSchema = z.object({
    studentId: z.number()
        .int('ID do estudante deve ser um número inteiro')
        .positive('ID do estudante deve ser positivo'),
    
    courseId: z.number()
        .int('ID do curso deve ser um número inteiro')
        .positive('ID do curso deve ser positivo'),
    
    status: z.enum(['active', 'completed', 'cancelled'])
        .default('active')
        .optional(),
});

export const updateEnrollmentSchema = z.object({
    status: z.enum(['active', 'completed', 'cancelled'])
        .optional(),
});

// Inferir tipos TypeScript dos schemas Zod
export type CreateEnrollmentDTO = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentDTO = z.infer<typeof updateEnrollmentSchema>;