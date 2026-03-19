import type { Context } from "hono";
import { StudentIdSchema } from "../schemas/student.schema";
import { studentService } from "../services/student.service";
import {
    renderStudentList,
    renderStudent,
    renderNotFound,
    renderBadRequest,
    renderServerError,
} from "../views/student.view";

export async function getAllStudents(c: Context) {
    try {
        const students = studentService.findAll();
        return c.json(renderStudentList(students));
    } catch {
        return c.json(renderServerError(), 500);
    }
}

export async function getStudentById(c: Context) {
    try {
        const parsed = StudentIdSchema.safeParse({ id: c.req.param("id") });

        if (!parsed.success) {
            return c.json(
                renderBadRequest("L'id fourni n'est pas un nombre valide."),
                400,
            );
        }

        const student = studentService.findById(parsed.data.id);

        if (!student) {
            return c.json(renderNotFound(parsed.data.id), 404);
        }

        return c.json(renderStudent(student));
    } catch {
        return c.json(renderServerError(), 500);
    }
}
