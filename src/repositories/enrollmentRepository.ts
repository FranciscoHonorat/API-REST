import prisma from "../lib/prisma";
import { CreateEnrollmentDTO, UpdateEnrollmentDTO } from "../types/enrollment";

export class EnrollmentRepository {
    // Buscar todas as matrículas (com student e course)
    async findAll() {
        return await prisma.enrollment.findMany({
            include: {
                student: true,
                course: true
            }
        });
    }

    // Buscar matrícula por ID
    async findById(id: number) {
        return await prisma.enrollment.findUnique({
            where: { id },
            include: {
                student: true,
                course: true
            }
        });
    }

    // Buscar matrículas de um estudante específico
    async findByStudentId(studentId: number) {
        return await prisma.enrollment.findMany({
            where: { studentId },
            include: {
                course: true,
                student: true
            }
        });
    }

    // Buscar matrículas de um curso específico
    async findByCourseId(courseId: number) {
        return await prisma.enrollment.findMany({
            where: { courseId },
            include: {
                student: true,
                course: true
            }
        });
    }

    // Verificar se já existe matrícula (evitar duplicatas)
    async findByStudentAndCourse(studentId: number, courseId: number) {
        return await prisma.enrollment.findUnique({
            where: {
                studentId_courseId: {
                    studentId,
                    courseId
                }
            }
        });
    }

    // Criar matrícula
    async create(data: CreateEnrollmentDTO) {
        return await prisma.enrollment.create({
            data,
            include: {
                student: true,
                course: true
            }
        });
    }

    // Atualizar matrícula (geralmente só o status)
    async update(id: number, data: UpdateEnrollmentDTO) {
        return await prisma.enrollment.update({
            where: { id },
            data,
            include: {
                student: true,
                course: true
            }
        });
    }

    // Deletar matrícula
    async delete(id: number) {
        return await prisma.enrollment.delete({
            where: { id }
        });
    }
}