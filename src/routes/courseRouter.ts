import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { validate } from '../middlewares/validator';
import { validateQuery } from '../middlewares/validateQuery';
import { validateId } from '../middlewares/validateParams';
import { strictLimiter } from '../middlewares/rateLimiter';
import { createCourseSchema, updateCourseSchema } from '../types/course';
import { courseQuerySchema } from '../types/queryParams';

const router = Router();
const controller = new CourseController();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Listar todos os cursos
 *     description: |
 *       Retorna lista paginada de cursos com filtros e ordenação.
 *       
 *       ### Filtros Disponíveis
 *       - **name**: Busca parcial no nome do curso (case-insensitive)
 *       - **instructor**: Busca parcial no nome do instrutor (case-insensitive)
 *       - **duration**: Filtrar por duração exata em horas
 *       
 *       ### Ordenação
 *       - **sortBy**: Campos disponíveis: id, name, instructor, duration, createdAt
 *       - **order**: asc (crescente) ou desc (decrescente)
 *       
 *       ### Paginação
 *       - **page**: Número da página (padrão: 1)
 *       - **limit**: Items por página (padrão: 10, máx: 100)
 *       
 *       ### Exemplos de Uso
 *       - Buscar cursos de TypeScript: `?name=typescript`
 *       - Cursos de um instrutor: `?instructor=maria`
 *       - Cursos de 40 horas: `?duration=40`
 *       - Cursos mais longos primeiro: `?sortBy=duration&order=desc`
 *     tags: [Courses]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome do curso (busca parcial, case-insensitive)
 *         example: typescript
 *       - in: query
 *         name: instructor
 *         schema:
 *           type: string
 *         description: Filtrar por nome do instrutor (busca parcial, case-insensitive)
 *         example: maria
 *       - in: query
 *         name: duration
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar por duração exata em horas
 *         example: 40
 *     responses:
 *       200:
 *         description: Lista paginada de cursos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCourses'
 *             example:
 *               data:
 *                 - id: 1
 *                   name: "TypeScript Avançado"
 *                   instructor: "Prof. Maria Santos"
 *                   duration: 40
 *                   createdAt: "2026-01-29T19:00:00.000Z"
 *                   enrollments: []
 *                 - id: 2
 *                   name: "Node.js Fundamentals"
 *                   instructor: "Prof. João Silva"
 *                   duration: 60
 *                   createdAt: "2026-01-28T10:00:00.000Z"
 *                   enrollments: []
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/', validateQuery(courseQuerySchema), (req, res, next) => controller.getAll(req, res, next));

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Buscar curso por ID
 *     description: |
 *       Retorna um curso específico com todas as suas informações e matrículas.
 *       
 *       ### Dados Retornados
 *       - Informações básicas do curso
 *       - Lista de todas as matrículas neste curso
 *       - Dados dos estudantes matriculados (se houver)
 *     tags: [Courses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *             example:
 *               id: 1
 *               name: "TypeScript Avançado"
 *               instructor: "Prof. Maria Santos"
 *               duration: 40
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *               enrollments:
 *                 - id: 1
 *                   studentId: 1
 *                   courseId: 1
 *                   status: active
 *                   student:
 *                     id: 1
 *                     name: "João Silva"
 *                     email: "joao@email.com"
 *                 - id: 2
 *                   studentId: 2
 *                   courseId: 1
 *                   status: active
 *                   student:
 *                     id: 2
 *                     name: "Maria Oliveira"
 *                     email: "maria@email.com"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', validateId(), (req, res, next) => controller.getById(req, res, next));

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Criar novo curso
 *     description: |
 *       Cria um novo curso no sistema.
 *       
 *       ### Validações Automáticas
 *       - ✅ Nome deve ter entre 3 e 255 caracteres
 *       - ✅ Instrutor deve ter entre 3 e 255 caracteres
 *       - ✅ Duração deve ser um número positivo (mínimo 1 hora)
 *       - ✅ Nome do curso deve ser único (não pode duplicar)
 *       
 *       ### Campos Obrigatórios
 *       Todos os campos são obrigatórios:
 *       - **name**: Nome do curso
 *       - **instructor**: Nome do instrutor responsável
 *       - **duration**: Carga horária em horas
 *       
 *       ### Rate Limiting
 *       Limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, instructor, duration]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 description: Nome do curso (deve ser único)
 *                 example: "Introdução ao TypeScript"
 *               instructor:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 description: Nome completo do instrutor
 *                 example: "Prof. Maria Santos"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 description: Duração do curso em horas
 *                 example: 40
 *           examples:
 *             Curso Básico:
 *               summary: Curso de curta duração
 *               value:
 *                 name: "JavaScript Básico"
 *                 instructor: "Prof. João Silva"
 *                 duration: 20
 *             Curso Avançado:
 *               summary: Curso completo de longa duração
 *               value:
 *                 name: "Full Stack Development"
 *                 instructor: "Prof. Ana Costa"
 *                 duration: 120
 *             Bootcamp:
 *               summary: Bootcamp intensivo
 *               value:
 *                 name: "Web Development Bootcamp"
 *                 instructor: "Prof. Carlos Mendes"
 *                 duration: 200
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *             example:
 *               id: 1
 *               name: "TypeScript Avançado"
 *               instructor: "Prof. Maria Santos"
 *               duration: 40
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *               enrollments: []
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Curso com este nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: "name já existe"
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post('/', strictLimiter, validate(createCourseSchema), (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Atualizar curso
 *     description: |
 *       Atualiza informações de um curso existente.
 *       
 *       ### Campos Atualizáveis
 *       Todos os campos são opcionais (envie apenas o que deseja alterar):
 *       - **name**: Nome do curso
 *       - **instructor**: Nome do instrutor
 *       - **duration**: Carga horária
 *       
 *       ### Validações
 *       - Se atualizar o nome, ele deve continuar único
 *       - Duração deve ser um número positivo
 *       - Mínimo de 3 caracteres para nome e instrutor
 *       
 *       ### ⚠️ ATENÇÃO
 *       Se o curso já possui matrículas ativas, considere:
 *       - Alterações na duração podem afetar planejamento dos estudantes
 *       - Mudança de instrutor pode impactar a qualidade esperada
 *       
 *       ### Rate Limiting
 *       Limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Courses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "TypeScript Avançado 2.0"
 *               instructor:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "Prof. Maria Santos"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 50
 *           examples:
 *             Atualizar Nome:
 *               summary: Renomear curso
 *               value:
 *                 name: "TypeScript Avançado - Edição 2026"
 *             Trocar Instrutor:
 *               summary: Alterar instrutor responsável
 *               value:
 *                 instructor: "Prof. João Silva"
 *             Aumentar Carga Horária:
 *               summary: Adicionar mais horas ao curso
 *               value:
 *                 duration: 60
 *             Atualização Completa:
 *               summary: Atualizar todos os campos
 *               value:
 *                 name: "Web Development Completo"
 *                 instructor: "Prof. Ana Costa"
 *                 duration: 80
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *             example:
 *               id: 1
 *               name: "TypeScript Avançado 2.0"
 *               instructor: "Prof. Maria Santos"
 *               duration: 50
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *               enrollments: []
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.patch('/:id', strictLimiter, validateId(), validate(updateCourseSchema), (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Deletar curso
 *     description: |
 *       Remove completamente um curso do sistema.
 *       
 *       ### ⚠️ ATENÇÃO - IMPORTANTE!
 *       
 *       #### O que acontece ao deletar um curso:
 *       - ❌ O curso é **permanentemente removido**
 *       - ❌ **TODAS as matrículas** relacionadas são deletadas (cascata)
 *       - ❌ Estudantes perdem acesso ao histórico deste curso
 *       - ❌ **Esta ação é IRREVERSÍVEL!**
 *       
 *       #### Recomendações:
 *       - ✅ Exporte os dados antes de deletar
 *       - ✅ Notifique os estudantes matriculados
 *       - ✅ Considere criar um campo "archived" ao invés de deletar
 *       - ✅ Faça backup do banco antes desta operação
 *       
 *       #### Quando usar:
 *       - Curso criado por engano
 *       - Curso teste/draft sem matrículas
 *       - Limpeza de dados antigos (com cuidado!)
 *       
 *       ### Rate Limiting
 *       Limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Courses]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: |
 *           Curso deletado com sucesso (sem conteúdo na resposta).
 *           Todas as matrículas relacionadas também foram removidas.
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.delete('/:id', strictLimiter, validateId(), (req, res, next) => controller.delete(req, res, next));

export default router;