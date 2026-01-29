import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { StudentRepository } from '../repositories/studentRepository';
import { CourseRepository } from '../repositories/courseRepository';
import { CreateEnrollmentDTO, UpdateEnrollmentDTO, createEnrollmentSchema } from '../types/enrollment';
import { EnrollmentFilters } from '../types/filters';
import { SortOrder, ENROLLMENT_SORTABLE_FIELDS } from '../types/sorting';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../types/pagination';
import { AppError } from '../types/errorHandler';

export class EnrollmentService {
    private repository: EnrollmentRepository;
    private studentRepository: StudentRepository;
    private courseRepository: CourseRepository;

    constructor() {
        this.repository = new EnrollmentRepository();
        this.studentRepository = new StudentRepository();
        this.courseRepository = new CourseRepository();
    }

    async getAllEnrollments() {
        return await this.repository.findAll();
    }

    async getAllEnrollmentsPaginated(
        page: number = DEFAULT_PAGE, 
        limit: number = DEFAULT_LIMIT,
        filters?: EnrollmentFilters,
        sortBy: string = 'createdAt',
        order: SortOrder = 'desc'
    ): Promise<PaginatedResponse<any>> {
        if (page < 1) page = DEFAULT_PAGE;
        if (limit < 1) limit = DEFAULT_LIMIT;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;
        
        if (!ENROLLMENT_SORTABLE_FIELDS.includes(sortBy)) {
            sortBy = 'createdAt';
        }
        
        if (order !== 'asc' && order !== 'desc') {
            order = 'desc';
        }
        
        const { enrollments, total } = await this.repository.findAllPaginated(
            page, 
            limit, 
            filters,
            sortBy,
            order
        );
        
        return {
            data: enrollments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getEnrollmentById(id: number) {
        return await this.repository.findById(id);
    }

    async getEnrollmentsByStudent(studentId: number) {
        return await this.repository.findByStudent(studentId);
    }

    async getEnrollmentsByCourse(courseId: number) {
        return await this.repository.findByCourse(courseId);
    }

    async createEnrollment(data: CreateEnrollmentDTO) {
        // Validar dados com Zod
        const validatedData = createEnrollmentSchema.parse(data);

        // Verificar se estudante existe
        const student = await this.studentRepository.findById(validatedData.studentId);
        if (!student) {
            throw new AppError('Estudante não encontrado', 404);
        }

        // Verificar se curso existe
        const course = await this.courseRepository.findById(validatedData.courseId);
        if (!course) {
            throw new AppError('Curso não encontrado', 404);
        }

        // Verificar se já existe matrícula
        const existingEnrollment = await this.repository.findByStudentAndCourse(
            validatedData.studentId,
            validatedData.courseId
        );

        if (existingEnrollment) {
            throw new AppError('Estudante já está matriculado neste curso', 409);
        }

        return await this.repository.create(validatedData);
    }

    async updateEnrollment(id: number, data: UpdateEnrollmentDTO) {
        return await this.repository.update(id, data);
    }

    async deleteEnrollment(id: number) {
        return await this.repository.delete(id);
    }
}


