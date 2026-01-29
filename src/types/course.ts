import { z } from 'zod';

// Schemas de validação Zod (campos baseados no Prisma schema)

export const createCourseSchema = z.object({
    name: z.string()
        .min(3, "Nome do curso deve ter no mínimo 3 caracteres")
        .max(100, "Nome do curso deve ter no máximo 100 caracteres")
        .trim(),
    
    description: z.string()
        .min(10, "Descrição deve ter no mínimo 10 caracteres")
        .max(500, "Descrição deve ter no máximo 500 caracteres")
        .trim()
        .optional()
        .or(z.literal('')), // Campo opcional no Prisma
    
    instructor: z.string()
        .min(3, "Nome do instrutor deve ter no mínimo 3 caracteres")
        .max(100, "Nome do instrutor deve ter no máximo 100 caracteres")
        .trim(),
    
    duration: z.number()
        .int("Duração deve ser um número inteiro")
        .min(1, "Duração deve ser de no mínimo 1 hora")
        .max(1000, "Duração deve ser de no máximo 1000 horas"),
});

export const updateCourseSchema = z.object({
    name: z.string()
        .min(3, "Nome do curso deve ter no mínimo 3 caracteres")
        .max(100, "Nome do curso deve ter no máximo 100 caracteres")
        .trim()
        .optional(),
    
    description: z.string()
        .min(10, "Descrição deve ter no mínimo 10 caracteres")
        .max(500, "Descrição deve ter no máximo 500 caracteres")
        .trim()
        .optional()
        .or(z.literal('')),
    
    instructor: z.string()
        .min(3, "Nome do instrutor deve ter no mínimo 3 caracteres")
        .max(100, "Nome do instrutor deve ter no máximo 100 caracteres")
        .trim()
        .optional(),
    
    duration: z.number()
        .int("Duração deve ser um número inteiro")
        .min(1, "Duração deve ser de no mínimo 1 hora")
        .max(1000, "Duração deve ser de no máximo 1000 horas")
        .optional(),
});

// Inferir tipos TypeScript dos schemas Zod
export type CreateCourseDTO = z.infer<typeof createCourseSchema>;
export type UpdateCourseDTO = z.infer<typeof updateCourseSchema>;