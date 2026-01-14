export interface CreateStudentDTO {
    name: string;
    email: string;
    phone?: string;
}

export interface UpdateStudentDTO {
    name?: string;
    email?: string;
    phone?: string;
}

