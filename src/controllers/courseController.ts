import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/courseService';
import { CourseFilters } from '../types/filters';
import { SortOrder } from '../types/sorting';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../types/pagination';

export class CourseController {
    private service: CourseService;

    constructor() {
        this.service = new CourseService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validatedQuery || req.query;
            
            const page = Number(query.page) || DEFAULT_PAGE;
            const limit = Number(query.limit) || DEFAULT_LIMIT;
            
            const filters: CourseFilters = {};
            if (query.name) filters.name = query.name as string;
            if (query.instructor) filters.instructor = query.instructor as string;
            if (query.duration) filters.duration = Number(query.duration);
            
            const sortBy = (query.sortBy as string) || 'createdAt';
            const order = (query.order as SortOrder) || 'desc';
            
            const result = await this.service.getAllCoursesPaginated(
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
            const course = await this.service.getCourseById(id);
            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const course = await this.service.createCourse(req.body);
            res.status(201).json(course);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const course = await this.service.updateCourse(id, req.body);
            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            await this.service.deleteCourse(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}