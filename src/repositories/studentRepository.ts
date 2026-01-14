import prisma from "../lib/prisma";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export class StudentRepository {
    async findAll() {
        return await prisma.student.findMany({
            include: {
                enrollments: {
                    include: {
                        course: true
                    }
                }
            }
        });
    }

    async findById(id: number) {
        return await prisma.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: true
                    }
                }
            }
        });
    }

    async create(data: CreateStudentDTO) {
        return await prisma.student.create({
            data
        });
    }

    async update(id: number, data: UpdateStudentDTO) {
        return await prisma.student.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return await prisma.student.delete({
            where: { id }
        });
    }
}