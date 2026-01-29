import { StudentRepository } from '../repositories/studentRepository';
import { CreateStudentDTO, UpdateStudentDTO } from '../types/student';
import { StudentFilters } from '../types/filters';
import { SortOrder, STUDENT_SORTABLE_FIELDS } from '../types/sorting';
import { PaginatedResponse, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '../types/pagination';

export class StudentService {
    private repository: StudentRepository;

    constructor() {
        this.repository = new StudentRepository();
    }

    async getAllStudents() {
        return await this.repository.findAll();
    }

    async getAllStudentsPaginated(
        page: number = DEFAULT_PAGE, 
        limit: number = DEFAULT_LIMIT,
        filters?: StudentFilters,
        sortBy: string = 'createdAt',
        order: SortOrder = 'desc'
    ): Promise<PaginatedResponse<any>> {
        if (page < 1) page = DEFAULT_PAGE;
        if (limit < 1) limit = DEFAULT_LIMIT;
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;
        
        if (!STUDENT_SORTABLE_FIELDS.includes(sortBy)) {
            sortBy = 'createdAt';
        }
        
        if (order !== 'asc' && order !== 'desc') {
            order = 'desc';
        }
        
        const { students, total } = await this.repository.findAllPaginated(
            page, 
            limit, 
            filters,
            sortBy,
            order
        );
        
        return {
            data: students,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getStudentById(id: number) {
        return await this.repository.findById(id);
    }

    async createStudent(data: CreateStudentDTO) {
        return await this.repository.create(data);
    }

    async updateStudent(id: number, data: UpdateStudentDTO) {
        return await this.repository.update(id, data);
    }

    async deleteStudent(id: number) {
        return await this.repository.delete(id);
    }
}