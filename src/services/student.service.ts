import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Student, CreateStudentDto } from "../schemas/student.schema";

const DATA_PATH = join(process.cwd(), "data/students.json");

function readStudents(): Student[] {
    try {
        const raw = readFileSync(DATA_PATH, "utf-8");
        return JSON.parse(raw) as Student[];
    } catch {
        return [];
    }
}

function writeStudents(students: Student[]): void {
    writeFileSync(DATA_PATH, JSON.stringify(students, null, 4), "utf-8");
}

export class StudentService {
    findAll(): Student[] {
        return readStudents();
    }
    findById(id: number): Student | undefined {
        return readStudents().find((s) => s.id === id);
    }
    create(dto: CreateStudentDto): Student {
        const students = readStudents();

        const emailConflict = students.find(
            (s) => s.email.toLowerCase() === dto.email.toLowerCase(),
        );
        if (emailConflict) {
            throw new Error("EMAIL_CONFLICT");
        }

        const maxId = students.reduce((max, s) => Math.max(max, s.id), 0);

        const newStudent: Student = {
            id: maxId + 1,
            ...dto,
            email: dto.email.toLowerCase(),
        };

        students.push(newStudent);
        writeStudents(students);

        return newStudent;
    }
    update(id: number, dto: CreateStudentDto): Student | undefined {
        const students = readStudents();
        const index = students.findIndex((s) => s.id === id);

        if (index === -1) return undefined;

        const emailConflict = students.find(
            (s) =>
                s.email.toLowerCase() === dto.email.toLowerCase() &&
                s.id !== id,
        );
        if (emailConflict) {
            throw new Error("EMAIL_CONFLICT");
        }

        const updated: Student = {
            ...dto,
            id,
            email: dto.email.toLowerCase(),
        };

        students[index] = updated;
        writeStudents(students);

        return updated;
    }

    delete(id: number): boolean {
        const students = readStudents();
        const index = students.findIndex((s) => s.id === id);

        if (index === -1) return false;

        students.splice(index, 1);
        writeStudents(students);

        return true;
    }

    getStats() {
        const students = readStudents();

        const totalStudents = students.length;

        const averageGrade =
            totalStudents > 0
                ? Math.round(
                      (students.reduce((sum, s) => sum + s.grade, 0) /
                          totalStudents) *
                          100,
                  ) / 100
                : 0;

        const studentsByField = students.reduce<Record<string, number>>(
            (acc, s) => {
                acc[s.field] = (acc[s.field] ?? 0) + 1;
                return acc;
            },
            {},
        );

        const bestStudent = students.reduce<Student | null>((best, s) => {
            if (!best || s.grade > best.grade) return s;
            return best;
        }, null);

        return {
            totalStudents,
            averageGrade,
            studentsByField,
            bestStudent,
        };
    }
}

export const studentService = new StudentService();
