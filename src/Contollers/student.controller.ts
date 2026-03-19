import type { Context } from "hono";
import { ZodError } from "zod";
import {
    StudentIdSchema,
    CreateStudentSchema,
} from "../schemas/student.schema";
import { studentService } from "../services/student.service";
import {
    renderStudentList,
    renderStudent,
    renderCreated,
    renderUpdated,
    renderDeleted,
    renderStats,
    renderNotFound,
    renderValidationError,
    renderConflict,
    renderBadRequest,
    renderServerError,
} from "../views/student.view";

function formatZodErrors(error: ZodError): Record<string, string[]> {
    return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const key = issue.path.join(".") || "general";
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue.message);
        return acc;
    }, {});
}

export async function getAllStudents(c: Context) {
    try {
        const students = studentService.findAll();
        return c.json(renderStudentList(students));
    } catch {
        return c.json(renderServerError(), 500);
    }
}

export async function getStudentStats(c: Context) {
    try {
        const stats = studentService.getStats();
        return c.json(renderStats(stats), 200);
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

export async function createStudent(c: Context) {
    try {
        const body = await c.req.json().catch(() => null);

        if (body === null) {
            return c.json(
                renderBadRequest(
                    "Le corps de la requête n'est pas un JSON valide.",
                ),
                400,
            );
        }

        const parsed = CreateStudentSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                renderValidationError(formatZodErrors(parsed.error)),
                400,
            );
        }

        const student = studentService.create(parsed.data);
        return c.json(renderCreated(student), 201);
    } catch (err) {
        if (err instanceof Error && err.message === "EMAIL_CONFLICT") {
            const email = (await c.req.json().catch(() => ({})))?.email ?? "";
            return c.json(renderConflict(email), 409);
        }
        return c.json(renderServerError(), 500);
    }
}

export async function updateStudent(c: Context) {
    try {
        const parsed = StudentIdSchema.safeParse({ id: c.req.param("id") });

        if (!parsed.success) {
            return c.json(
                renderBadRequest("L'id fourni n'est pas un nombre valide."),
                400,
            );
        }

        const body = await c.req.json().catch(() => null);

        if (body === null) {
            return c.json(
                renderBadRequest(
                    "Le corps de la requête n'est pas un JSON valide.",
                ),
                400,
            );
        }

        const bodyParsed = CreateStudentSchema.safeParse(body);

        if (!bodyParsed.success) {
            return c.json(
                renderValidationError(formatZodErrors(bodyParsed.error)),
                400,
            );
        }

        const updated = studentService.update(parsed.data.id, bodyParsed.data);

        if (!updated) {
            return c.json(renderNotFound(parsed.data.id), 404);
        }

        return c.json(renderUpdated(updated));
    } catch (err) {
        if (err instanceof Error && err.message === "EMAIL_CONFLICT") {
            const email = (await c.req.json().catch(() => ({})))?.email ?? "";
            return c.json(renderConflict(email), 409);
        }
        return c.json(renderServerError(), 500);
    }
}

export async function deleteStudent(c: Context) {
    try {
        const parsed = StudentIdSchema.safeParse({ id: c.req.param("id") });

        if (!parsed.success) {
            return c.json(
                renderBadRequest("L'id fourni n'est pas un nombre valide."),
                400,
            );
        }

        const deleted = studentService.delete(parsed.data.id);

        if (!deleted) {
            return c.json(renderNotFound(parsed.data.id), 404);
        }

        return c.json(renderDeleted(parsed.data.id), 200);
    } catch {
        return c.json(renderServerError(), 500);
    }
}
