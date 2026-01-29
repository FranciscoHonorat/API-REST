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

  async findAllPaginated(
    page: number, 
    limit: number,
    filters?: CourseFilters,
    sortBy: string = 'createdAt',
    order: SortOrder = 'desc'
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters?.name) {
        where.name = {
            contains: filters.name,
            mode: 'insensitive'
        };
    }
    
    if (filters?.instructor) {
        where.instructor = {
            contains: filters.instructor,
            mode: 'insensitive'
        };
    }
    
    if (filters?.duration) {
        where.duration = filters.duration;
    }
    
    const orderBy: any = {};
    orderBy[sortBy] = order;
    
    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                enrollments: {
                    include: {
                        student: true
                    }
                }
            }
        }),
        prisma.course.count({ where })
    ]);
    
    return { courses, total };
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


