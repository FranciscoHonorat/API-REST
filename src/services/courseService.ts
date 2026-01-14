import { CourseRepository } from '../repositories/courseRepository';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course';
import { AppError } from '../types/errorHandler';

export class CourseService {
  private repository: CourseRepository;

  constructor() {
    this.repository = new CourseRepository();
  }

  async getAllCourses() {
    return await this.repository.findAll();
  }

  async getCourseById(id: number) {
    const course = await this.repository.findById(id);
    
    if (!course) {
      throw new AppError('Curso não encontrado', 404);
    }
    
    return course;
  }

  async createCourse(data: CreateCourseDTO) {
    if (!data.name || !data.instructor || !data.duration) {
      throw new AppError('Campos obrigatórios ausentes', 400);
    }

    return await this.repository.create(data);
  }

  async updateCourse(id: number, data: UpdateCourseDTO) {
    await this.getCourseById(id);
    return await this.repository.update(id, data);
  }

  async deleteCourse(id: number) {
    await this.getCourseById(id);
    return await this.repository.delete(id);
  }
}