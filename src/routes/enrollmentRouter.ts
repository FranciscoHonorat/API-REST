import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollmentController';
import { validate } from '../middlewares/validator';
import { validateQuery } from '../middlewares/validateQuery';
import { validateId } from '../middlewares/validateParams';
import { strictLimiter } from '../middlewares/rateLimiter';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../types/enrollment';
import { enrollmentQuerySchema } from '../types/queryParams';

const router = Router();
const controller = new EnrollmentController();

/**
 * @swagger
 * /enrollments/student/{studentId}:
 *   get:
 *     summary: Listar matrículas de um estudante
 *     description: Retorna todas as matrículas de um estudante específico com os dados dos cursos
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do estudante
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de matrículas do estudante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *             example:
 *               - id: 1
 *                 studentId: 1
 *                 courseId: 1
 *                 status: active
 *                 enrolledAt: "2026-01-29T19:00:00.000Z"
 *                 course:
 *                   id: 1
 *                   name: "TypeScript Avançado"
 *                   instructor: "Prof. Maria"
 *                   duration: 40
 *               - id: 2
 *                 studentId: 1
 *                 courseId: 2
 *                 status: completed
 *                 enrolledAt: "2026-01-15T10:00:00.000Z"
 *                 course:
 *                   id: 2
 *                   name: "Node.js Fundamentals"
 *                   instructor: "Prof. João"
 *                   duration: 60
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/student/:studentId', validateId('studentId'), (req, res, next) => controller.getByStudent(req, res, next));

/**
 * @swagger
 * /enrollments/course/{courseId}:
 *   get:
 *     summary: Listar matrículas de um curso
 *     description: Retorna todas as matrículas de um curso específico com os dados dos estudantes
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do curso
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de matrículas do curso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *             example:
 *               - id: 1
 *                 studentId: 1
 *                 courseId: 1
 *                 status: active
 *                 enrolledAt: "2026-01-29T19:00:00.000Z"
 *                 student:
 *                   id: 1
 *                   name: "João Silva"
 *                   email: "joao@email.com"
 *                   phone: "11987654321"
 *               - id: 3
 *                 studentId: 2
 *                 courseId: 1
 *                 status: active
 *                 enrolledAt: "2026-01-28T14:30:00.000Z"
 *                 student:
 *                   id: 2
 *                   name: "Maria Santos"
 *                   email: "maria@email.com"
 *                   phone: "11987654322"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/course/:courseId', validateId('courseId'), (req, res, next) => controller.getByCourse(req, res, next));

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Listar todas as matrículas
 *     description: |
 *       Retorna lista paginada de matrículas com filtros e ordenação.
 *       
 *       ### Filtros Disponíveis
 *       - **status**: Filtrar por status (active, completed, cancelled)
 *       - **studentId**: Filtrar por ID do estudante
 *       - **courseId**: Filtrar por ID do curso
 *       
 *       ### Ordenação
 *       - **sortBy**: Campos disponíveis: id, status, enrolledAt, createdAt
 *       - **order**: asc (crescente) ou desc (decrescente)
 *       
 *       ### Paginação
 *       - **page**: Número da página (padrão: 1)
 *       - **limit**: Items por página (padrão: 10, máx: 100)
 *     tags: [Enrollments]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, cancelled]
 *         description: Filtrar por status da matrícula
 *         example: active
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar por ID do estudante
 *         example: 1
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtrar por ID do curso
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista paginada de matrículas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEnrollments'
 *             example:
 *               data:
 *                 - id: 1
 *                   studentId: 1
 *                   courseId: 1
 *                   status: active
 *                   enrolledAt: "2026-01-29T19:00:00.000Z"
 *                   createdAt: "2026-01-29T19:00:00.000Z"
 *                   student:
 *                     id: 1
 *                     name: "João Silva"
 *                     email: "joao@email.com"
 *                   course:
 *                     id: 1
 *                     name: "TypeScript Avançado"
 *                     instructor: "Prof. Maria"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 50
 *                 totalPages: 5
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/', validateQuery(enrollmentQuerySchema), (req, res, next) => controller.getAll(req, res, next));

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Buscar matrícula por ID
 *     description: Retorna uma matrícula específica com todos os dados do estudante e curso
 *     tags: [Enrollments]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Matrícula encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *             example:
 *               id: 1
 *               studentId: 1
 *               courseId: 1
 *               status: active
 *               enrolledAt: "2026-01-29T19:00:00.000Z"
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *               student:
 *                 id: 1
 *                 name: "João Silva"
 *                 email: "joao@email.com"
 *                 phone: "11987654321"
 *               course:
 *                 id: 1
 *                 name: "TypeScript Avançado"
 *                 instructor: "Prof. Maria Santos"
 *                 duration: 40
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', validateId(), (req, res, next) => controller.getById(req, res, next));

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Criar nova matrícula
 *     description: |
 *       Matricula um estudante em um curso.
 *       
 *       ### Validações Automáticas
 *       - ✅ Verifica se o estudante existe
 *       - ✅ Verifica se o curso existe
 *       - ✅ Impede matrícula duplicada (mesmo estudante no mesmo curso)
 *       
 *       ### Status Disponíveis
 *       - **active**: Matrícula ativa (padrão para novas matrículas)
 *       - **completed**: Curso concluído pelo estudante
 *       - **cancelled**: Matrícula cancelada
 *       
 *       ### Rate Limiting
 *       Este endpoint tem limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, courseId, status]
 *             properties:
 *               studentId:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID do estudante a ser matriculado
 *                 example: 1
 *               courseId:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID do curso
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 description: Status inicial da matrícula
 *                 default: active
 *                 example: active
 *           examples:
 *             Nova Matrícula Ativa:
 *               value:
 *                 studentId: 1
 *                 courseId: 1
 *                 status: active
 *             Matrícula Concluída:
 *               value:
 *                 studentId: 2
 *                 courseId: 3
 *                 status: completed
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *             example:
 *               id: 1
 *               studentId: 1
 *               courseId: 1
 *               status: active
 *               enrolledAt: "2026-01-29T19:00:00.000Z"
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         description: Estudante ou curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               Estudante não encontrado:
 *                 value:
 *                   status: error
 *                   message: "Estudante não encontrado"
 *               Curso não encontrado:
 *                 value:
 *                   status: error
 *                   message: "Curso não encontrado"
 *       409:
 *         description: Estudante já matriculado neste curso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: "Estudante já está matriculado neste curso"
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post('/', strictLimiter, validate(createEnrollmentSchema), (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /enrollments/{id}:
 *   patch:
 *     summary: Atualizar matrícula
 *     description: |
 *       Atualiza o status de uma matrícula existente.
 *       
 *       ### Campo Atualizável
 *       - **status**: Alterar status da matrícula
 *       
 *       ### Casos de Uso Comuns
 *       - 📚 Marcar curso como **concluído** (active → completed)
 *       - ❌ Cancelar matrícula (active → cancelled)
 *       - ♻️ Reativar matrícula (cancelled → active)
 *       
 *       **⚠️ Nota**: Os campos `studentId` e `courseId` não podem ser alterados.
 *       Para mudar de curso, delete a matrícula e crie uma nova.
 *       
 *       ### Rate Limiting
 *       Limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Enrollments]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 description: Novo status da matrícula
 *                 example: completed
 *           examples:
 *             Concluir Curso:
 *               summary: Marcar curso como concluído
 *               value:
 *                 status: completed
 *             Cancelar Matrícula:
 *               summary: Cancelar matrícula do estudante
 *               value:
 *                 status: cancelled
 *             Reativar Matrícula:
 *               summary: Reativar matrícula cancelada
 *               value:
 *                 status: active
 *     responses:
 *       200:
 *         description: Matrícula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *             example:
 *               id: 1
 *               studentId: 1
 *               courseId: 1
 *               status: completed
 *               enrolledAt: "2026-01-29T19:00:00.000Z"
 *               createdAt: "2026-01-29T19:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.patch('/:id', strictLimiter, validateId(), validate(updateEnrollmentSchema), (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Deletar matrícula
 *     description: |
 *       Remove completamente uma matrícula do sistema.
 *       
 *       ### ⚠️ ATENÇÃO
 *       - Esta ação é **irreversível**!
 *       - Todos os dados da matrícula serão **permanentemente deletados**
 *       - Considere usar `PATCH` com `status: cancelled` se quiser manter histórico
 *       
 *       ### Rate Limiting
 *       Limite de **10 requisições por 15 minutos** (operação de escrita).
 *     tags: [Enrollments]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Matrícula deletada com sucesso (sem conteúdo na resposta)
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.delete('/:id', strictLimiter, validateId(), (req, res, next) => controller.delete(req, res, next));

export default router;