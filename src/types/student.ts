import { z } from 'zod';

// Schemas de validação Zod (campos baseados no Prisma schema)

export const createStudentSchema = z.object({
    name: z.string()
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres")
        .trim(),
    
    email: z.string()
        .email("Email inválido")
        .toLowerCase()
        .trim(),
    
    phone: z.string()
        .min(10, "Telefone deve ter no mínimo 10 dígitos")
        .max(15, "Telefone deve ter no máximo 15 dígitos")
        .regex(/^\+?[0-9]+$/, "Telefone deve conter apenas números (pode começar com +)")
        .optional()
        .or(z.literal('')), // Aceita string vazia
});

export const updateStudentSchema = z.object({
    name: z.string()
        .min(3, 'Nome deve ter no mínimo 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim()
        .optional(),
    
    email: z.string()
        .email('Email inválido')
        .toLowerCase()
        .trim()
        .optional(),
    
    phone: z.string()
        .min(10, 'Telefone deve ter no mínimo 10 dígitos')
        .max(15, 'Telefone deve ter no máximo 15 dígitos')
        .regex(/^\+?[0-9]+$/, 'Telefone deve conter apenas números (pode começar com +)')
        .optional()
        .or(z.literal(''))
});

// Inferir tipos TypeScript dos schemas Zod
export type CreateStudentDTO = z.infer<typeof createStudentSchema>;
export type UpdateStudentDTO = z.infer<typeof updateStudentSchema>;
