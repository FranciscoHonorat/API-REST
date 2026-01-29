export interface StudentFilters {
    name?: string;
    email?: string;
    phone?: string;
}

export interface CourseFilters {
    name?: string;
    instructor?: string;
    durationMin?: number;
    durationMax?: number;
}

export interface EnrollmentFilters {
    status?: string;
    studentId?: number;
    courseId?: number;
}