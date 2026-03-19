import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

vi.mock("fs");

import { readFileSync, writeFileSync } from "fs";
import app from "../index";

const testStudents = [
    {
        id: 1,
        firstName: "Lucas",
        lastName: "Martin",
        email: "lucas.martin@test.fr",
        grade: 14.5,
        field: "informatique",
    },
    {
        id: 2,
        firstName: "Emma",
        lastName: "Dupont",
        email: "emma.dupont@test.fr",
        grade: 18.0,
        field: "mathématiques",
    },
    {
        id: 3,
        firstName: "Nathan",
        lastName: "Bernard",
        email: "nathan.bernard@test.fr",
        grade: 12.0,
        field: "physique",
    },
    {
        id: 4,
        firstName: "Chloé",
        lastName: "Lefevre",
        email: "chloe.lefevre@test.fr",
        grade: 16.5,
        field: "chimie",
    },
    {
        id: 5,
        firstName: "Hugo",
        lastName: "Moreau",
        email: "hugo.moreau@test.fr",
        grade: 9.5,
        field: "informatique",
    },
];

const validPayload = {
    firstName: "Lucas",
    lastName: "Martin",
    email: "lucas.updated@test.fr",
    grade: 19.0,
    field: "informatique",
};

function putStudent(id: number | string, body: unknown) {
    return app.request(`/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(testStudents));
    vi.mocked(writeFileSync).mockImplementation(() => undefined);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe("PUT /students/:id", () => {
    it("10. données valides doit renvoyer 200 et l'étudiant modifié", async () => {
        const res = await putStudent(1, validPayload);

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body).toHaveProperty("data");
        expect(body.data.id).toBe(1);
        expect(body.data.firstName).toBe(validPayload.firstName);
        expect(body.data.lastName).toBe(validPayload.lastName);
        expect(body.data.email).toBe(validPayload.email.toLowerCase());
        expect(body.data.grade).toBe(validPayload.grade);
        expect(body.data.field).toBe(validPayload.field);
        expect(vi.mocked(writeFileSync)).toHaveBeenCalledOnce();
    });

    it("11. ID inexistant doit renvoyer 404", async () => {
        const res = await putStudent(999, validPayload);

        expect(res.status).toBe(404);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("999");
        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });

    it("29. ID invalide doit renvoyer 400", async () => {
        const res = await putStudent("abc", validPayload);

        expect(res.status).toBe(400);

        const body = await res.json();
        expect(body.success).toBe(false);
    });

    it("30. email deja utilise par un autre etudiant doit renvoyer 409", async () => {
        const res = await putStudent(1, {
            ...validPayload,
            email: testStudents[1].email,
        });

        expect(res.status).toBe(409);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain(testStudents[1].email);
        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });
});
