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

export function renderCreated(student: Student): ApiSuccess<Student> {
    return {
        success: true,
        data: student,
    };
}

export function renderUpdated(student: Student): ApiSuccess<Student> {
    return {
        success: true,
        data: student,
    };
}

export function renderDeleted(id: number): ApiSuccess<{ message: string }> {
    return {
        success: true,
        data: {
            message: `L'étudiant avec l'id ${id} a été supprimé avec succès.`,
        },
    };
}

export function renderValidationError(
    errors: Record<string, string[]>,
): ApiError {
    return {
        success: false,
        message: "Les données fournies sont invalides.",
        errors,
    };
}

export function renderNotFound(id: number): ApiError {
    return {
        success: false,
        message: `Aucun étudiant trouvé avec l'id ${id}.`,
    };
}

export function renderConflict(email: string): ApiError {
    return {
        success: false,
        message: `L'email "${email}" est déjà utilisé par un autre étudiant.`,
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
