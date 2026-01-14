import prisma from '../lib/prisma';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course';

export class CourseRepository {
  async findAll() {
    return await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            student: true
          }
        }
      }
    });
  }

  async findById(id: number) {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            student: true
          }
        }
      }
    });
  }

  async create(data: CreateCourseDTO) {
    return await prisma.course.create({
      data
    });
  }

  async update(id: number, data: UpdateCourseDTO) {
    return await prisma.course.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return await prisma.course.delete({
      where: { id }
    });
  }
}


