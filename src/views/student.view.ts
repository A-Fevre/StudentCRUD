import type { Student } from "../schemas/student.schema";

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export function renderStudentList(students: Student[]): ApiSuccess<Student[]> {
    return {
        success: true,
        data: students,
    };
}

export function renderServerError(): ApiError {
    return {
        success: false,
        message: "Une erreur interne est survenue.",
    };
}
