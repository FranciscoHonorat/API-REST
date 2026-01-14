import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/courseService';

export class CourseController {
    private service: CourseService;

    constructor() {
        this.service = new CourseService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await this.service.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id, 10);
            const course = await this.service.getCourseById(id);
            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const course = await this.service.createCourse(req.body);
            res.status(201).json(course);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const course = await this.service.updateCourse(id, req.body);
            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            await this.service.deleteCourse(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}