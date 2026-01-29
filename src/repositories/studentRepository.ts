import prisma from "../lib/prisma";
import { CreateStudentDTO, UpdateStudentDTO } from "../types/student";

export class StudentRepository {
    async findAllPaginated(
        page: number,
        limit: number,
        filters?: StudentFilters,
        sortBy: string = "createdAt",
        order: SortOrder = "desc"
    ) {
        const skip = (page - 1) * limit;

        // Construir where corretamente
        const where: any = {};

        // Filtros individuais (AND lógico)
        if (filters?.name) {
            where.name = {
                contains: filters.name,
                mode: "insensitive",
            };
        }

        if (filters?.email) {
            where.email = {
                contains: filters.email,
                mode: "insensitive",
            };
        }

        if (filters?.phone) {
            where.phone = {
                contains: filters.phone,
            };
        }

        // Construir orderBy
        const orderBy: any = {};
        orderBy[sortBy] = order;

        const [students, total] = await Promise.all([
            prisma.student.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    enrollments: {
                        include: {
                            course: true,
                        },
                    },
                },
            }),
            prisma.student.count({ where }),
        ]);

        return { students, total };
    }

    async findById(id: number) {
        return await prisma.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: {
                        course: true,
                    },
                },
            },
        });
    }

    async create(data: CreateStudentDTO) {
        return await prisma.student.create({
            data,
        });
    }

    async update(id: number, data: UpdateStudentDTO) {
        return await prisma.student.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return await prisma.student.delete({
            where: { id },
        });
    }
}