import { StudentRepository } from "../repositories/studentRepository";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";
import { AppError } from "../types/errorHandler";

export class StudentService {
    private repository: StudentRepository;

    constructor() {
        this.repository = new StudentRepository();
    }

    async getAllStudents() {
        return await this.repository.findAll();
    }

    async getStudentById(id: number) {
        const student = await this.repository.findById(id);

        if (!student) {
            throw new AppError('Estudante não encontrado', 404);
        }

        return student;
    }

    async createStudent(data: CreateStudentDTO) {
        if (!data.name || !data.email) {
            throw new AppError('Campos obrigatórios ausentes', 400);
        }

        return await this.repository.create(data);
    }

    async updateStudent(id: number, data: UpdateStudentDTO) {
        await this.getStudentById(id);
        return await this.repository.update(id, data);
    }

    async deleteStudent(id: number) {
        await this.getStudentById(id);
        return await this.repository.delete(id);
    }
}