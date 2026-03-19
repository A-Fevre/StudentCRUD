import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Student } from "../schemas/student.schema";

const DATA_PATH = join(process.cwd(), "data/students.json");

function readStudents(): Student[] {
    try {
        const raw = readFileSync(DATA_PATH, "utf-8");
        return JSON.parse(raw) as Student[];
    } catch {
        return [];
    }
}

export class StudentService {
    findAll(): Student[] {
        return readStudents();
    }
}

export const studentService = new StudentService();
