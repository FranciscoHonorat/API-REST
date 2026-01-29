import { CourseRepository } from '../repositories/courseRepository';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course';
import { CourseFilters } from '../types/filters';
import { SortOrder, COURSE_SORTABLE_FIELDS } from '../types/sorting';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../types/pagination';

export class CourseService {
    private repository: CourseRepository;

    constructor() {
        this.repository = new CourseRepository();
    }

    async getAllCourses() {
        return await this.repository.findAll();
    }

    async getAllCoursesPaginated(
        page: number = DEFAULT_PAGE, 
        limit: number = DEFAULT_LIMIT,
        filters?: CourseFilters,
        sortBy: string = 'createdAt',
        order: SortOrder = 'desc'
    ): Promise<PaginatedResponse<any>> {
        if (page < 1) page = DEFAULT_PAGE;
        if (limit < 1) limit = DEFAULT_LIMIT;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;
        
        if (!COURSE_SORTABLE_FIELDS.includes(sortBy)) {
            sortBy = 'createdAt';
        }
        
        if (order !== 'asc' && order !== 'desc') {
            order = 'desc';
        }
        
        const { courses, total } = await this.repository.findAllPaginated(
            page, 
            limit, 
            filters,
            sortBy,
            order
        );
        
        return {
            data: courses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getCourseById(id: number) {
        return await this.repository.findById(id);
    }

    async createCourse(data: CreateCourseDTO) {
        return await this.repository.create(data);
    }

    async updateCourse(id: number, data: UpdateCourseDTO) {
        return await this.repository.update(id, data);
    }

    async deleteCourse(id: number) {
        return await this.repository.delete(id);
    }
}