import type { Context } from "hono";
import { studentService } from "../services/student.service";
import { renderStudentList, renderServerError } from "../views/student.view";

export async function getAllStudents(c: Context) {
    try {
        const students = studentService.findAll();
        return c.json(renderStudentList(students), 200);
    } catch {
        return c.json(renderServerError(), 500);
    }
}
