import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { validate } from '../middlewares/validator';
import { validateQuery } from '../middlewares/validateQuery';
import { validateId } from '../middlewares/validateParams';
import { strictLimiter } from '../middlewares/rateLimiter';
import { createStudentSchema, updateStudentSchema } from '../types/student';
import { studentQuerySchema } from '../types/queryParams';

const router = Router();
const controller = new StudentController();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Listar estudantes
 *     description: Retorna lista paginada de estudantes com filtros e ordenação
 *     tags: [Students]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome (parcial, case-insensitive)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (parcial, case-insensitive)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filtrar por telefone (parcial)
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedStudents'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.get('/', validateQuery(studentQuerySchema), (req, res, next) => controller.getAll(req, res, next));

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Buscar estudante por ID
 *     description: Retorna um estudante específico com suas matrículas
 *     tags: [Students]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Estudante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', validateId(), (req, res, next) => controller.getById(req, res, next));

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Criar novo estudante
 *     description: Cria um novo estudante no sistema
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudent'
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post('/', strictLimiter, validate(createStudentSchema), (req, res, next) => controller.create(req, res, next));

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Atualizar estudante
 *     description: Atualiza dados de um estudante existente
 *     tags: [Students]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudent'
 *     responses:
 *       200:
 *         description: Estudante atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.patch('/:id', strictLimiter, validateId(), validate(updateStudentSchema), (req, res, next) => controller.update(req, res, next));

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deletar estudante
 *     description: Remove um estudante do sistema
 *     tags: [Students]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Estudante deletado com sucesso
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.delete('/:id', strictLimiter, validateId(), (req, res, next) => controller.delete(req, res, next));

export default router;