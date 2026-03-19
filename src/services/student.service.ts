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
}

export const studentService = new StudentService();
