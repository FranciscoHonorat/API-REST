export interface CreateCourseDTO {
    name: string;
    description?: string;
    instructor: string;
    duration: number;
}

export interface UpdateCourseDTO {
    name?: string;
    description?: string;
    instructor?: string;
    duration?: number;
}
