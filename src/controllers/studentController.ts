import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService';
import { StudentFilters } from '../types/filters';
import { SortOrder } from '../types/sorting';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../types/pagination';

export class StudentController {
    private service: StudentService;

    constructor() {
        this.service = new StudentService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Usar validatedQuery se existir, senão usar query diretamente
            const query = req.validatedQuery || req.query;
            
            const page = Number(query.page) || DEFAULT_PAGE;
            const limit = Number(query.limit) || DEFAULT_LIMIT;
            
            const filters: StudentFilters = {};
            if (query.name) filters.name = query.name as string;
            if (query.email) filters.email = query.email as string;
            if (query.phone) filters.phone = query.phone as string;
            
            const sortBy = (query.sortBy as string) || 'createdAt';
            const order = (query.order as SortOrder) || 'desc';
            
            const result = await this.service.getAllStudentsPaginated(
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
            const student = await this.service.getStudentById(id);
            res.status(200).json(student);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const student = await this.service.createStudent(req.body);
            res.status(201).json(student);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const student = await this.service.updateStudent(id, req.body);
            res.status(200).json(student);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            await this.service.deleteStudent(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
