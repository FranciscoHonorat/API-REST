import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/studentService';

export class StudentController {
    private service: StudentService;

    constructor() {
        this.service = new StudentService();
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const students = await this.service.getAllStudents();
            res.status(200).json(students);
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
            const id = parseInt(req.params.id);
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
