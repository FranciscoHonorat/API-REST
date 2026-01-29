import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Management API',
            version: '1.0.0',
            description: `
                API REST para gerenciamento de estudantes, cursos e matrículas.
                
                ## Funcionalidades
                - ✅ CRUD completo de estudantes
                - ✅ CRUD completo de cursos
                - ✅ Gerenciamento de matrículas
                - ✅ Paginação, filtros e ordenação
                - ✅ Validação de dados com Zod
                - ✅ Rate limiting
                - ✅ Logs estruturados
                
                ## Segurança
                - Headers de segurança com Helmet
                - CORS configurado
                - Rate limiting (100 req/15min geral, 10 req/15min escrita)
                - Validação robusta de entrada
            `,
            contact: {
                name: 'Francisco Honorat',
                url: 'https://github.com/FranciscoHonorat',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Development server',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoint',
            },
            {
                name: 'Students',
                description: 'Endpoints para gerenciamento de estudantes',
            },
            {
                name: 'Courses',
                description: 'Endpoints para gerenciamento de cursos',
            },
            {
                name: 'Enrollments',
                description: 'Endpoints para gerenciamento de matrículas',
            },
        ],
        components: {
            schemas: {
                Student: {
                    type: 'object',
                    required: ['name', 'email', 'phone'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID auto-incrementado',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 255,
                            description: 'Nome completo do estudante',
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email único do estudante',
                            example: 'joao.silva@email.com',
                        },
                        phone: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 15,
                            description: 'Telefone do estudante',
                            example: '11987654321',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação',
                        },
                        enrollments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Enrollment' },
                        },
                    },
                },
                CreateStudent: {
                    type: 'object',
                    required: ['name', 'email', 'phone'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'joao@email.com',
                        },
                        phone: {
                            type: 'string',
                            example: '11987654321',
                        },
                    },
                },
                Course: {
                    type: 'object',
                    required: ['name', 'instructor', 'duration'],
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Introdução ao TypeScript',
                        },
                        instructor: {
                            type: 'string',
                            example: 'Prof. Maria Santos',
                        },
                        duration: {
                            type: 'integer',
                            description: 'Duração em horas',
                            example: 40,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        enrollments: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Enrollment' },
                        },
                    },
                },
                Enrollment: {
                    type: 'object',
                    required: ['studentId', 'courseId', 'status'],
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        studentId: {
                            type: 'integer',
                            example: 1,
                        },
                        courseId: {
                            type: 'integer',
                            example: 1,
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'completed', 'cancelled'],
                            example: 'active',
                        },
                        enrolledAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        student: { $ref: '#/components/schemas/Student' },
                        course: { $ref: '#/components/schemas/Course' },
                    },
                },
                PaginatedStudents: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Student' },
                        },
                        pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 50 },
                        totalPages: { type: 'integer', example: 5 },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string', example: 'Erro ao processar' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                PageParam: {
                    in: 'query',
                    name: 'page',
                    schema: { type: 'integer', minimum: 1, default: 1 },
                    description: 'Número da página',
                },
                LimitParam: {
                    in: 'query',
                    name: 'limit',
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    description: 'Items por página',
                },
                SortByParam: {
                    in: 'query',
                    name: 'sortBy',
                    schema: { type: 'string' },
                    description: 'Campo para ordenação',
                },
                OrderParam: {
                    in: 'query',
                    name: 'order',
                    schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
                    description: 'Direção da ordenação',
                },
                IdParam: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    description: 'ID do recurso',
                },
            },
            responses: {
                BadRequest: {
                    description: 'Requisição inválida',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' },
                        },
                    },
                },
                NotFound: {
                    description: 'Recurso não encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' },
                        },
                    },
                },
                Conflict: {
                    description: 'Conflito (recurso já existe)',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' },
                        },
                    },
                },
                TooManyRequests: {
                    description: 'Rate limit excedido',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Arquivos que contêm anotações
};

export const swaggerSpec = swaggerJsdoc(options);