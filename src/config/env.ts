import { z } from 'zod';

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    
    // Server
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    
    // Pagination
    DEFAULT_PAGE_SIZE: z.coerce.number().default(10),
    MAX_PAGE_SIZE: z.coerce.number().default(100),
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutos
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
    
    // CORS
    ALLOWED_ORIGINS: z.string().default('*'),
    
    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

// Validar e exportar variáveis
function validateEnv() {
    try {
        const env = envSchema.parse(process.env);
        return env;
    } catch (error) {
        console.error('❌ Invalid environment variables:');
        if (error instanceof z.ZodError) {
            error.errors.forEach(err => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }
        process.exit(1);
    }
}

export const env = validateEnv();