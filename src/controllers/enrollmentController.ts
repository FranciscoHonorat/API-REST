//Criação dos endspoints para o gerenciamento de matrículas
import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from '../services/enrollmentService';
import { EnrollmentFilters } from '../types/filters';
import { SortOrder } from '../types/sorting';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../types/pagination';

export class EnrollmentController {
    private service: EnrollmentService;

    constructor() {
        this.service = new EnrollmentService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validatedQuery || req.query;
            
            const page = Number(query.page) || DEFAULT_PAGE;
            const limit = Number(query.limit) || DEFAULT_LIMIT;
            
            const filters: EnrollmentFilters = {};
            if (query.status) filters.status = query.status as string;
            if (query.studentId) filters.studentId = Number(query.studentId);
            if (query.courseId) filters.courseId = Number(query.courseId);
            
            const sortBy = (query.sortBy as string) || 'createdAt';
            const order = (query.order as SortOrder) || 'desc';
            
            const result = await this.service.getAllEnrollmentsPaginated(
                page, 
                limit, 
                filters,
                sortBy,
                order
            );
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const enrollment = await this.service.getEnrollmentById(id);
            res.status(200).json(enrollment);
        } catch (error) {
            next(error);
        }
    }

    getByStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const studentId = parseInt(req.params.studentId, 10);
            const enrollments = await this.service.getEnrollmentsByStudent(studentId);
            res.status(200).json(enrollments);
        } catch (error) {
            next(error);
        }
    }

    getByCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = parseInt(req.params.courseId, 10);
            const enrollments = await this.service.getEnrollmentsByCourse(courseId);
            res.status(200).json(enrollments);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const enrollment = await this.service.createEnrollment(req.body);
            res.status(201).json(enrollment);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const enrollment = await this.service.updateEnrollment(id, req.body);
            res.status(200).json(enrollment);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            await this.service.deleteEnrollment(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}