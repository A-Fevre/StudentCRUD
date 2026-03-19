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

export function renderStudent(student: Student): ApiSuccess<Student> {
    return {
        success: true,
        data: student,
    };
}

export function renderNotFound(id: number): ApiError {
    return {
        success: false,
        message: `Aucun étudiant trouvé avec l'id ${id}.`,
    };
}

export function renderBadRequest(message: string): ApiError {
    return {
        success: false,
        message,
    };
}

export function renderServerError(): ApiError {
    return {
        success: false,
        message: "Une erreur interne est survenue.",
    };
}
