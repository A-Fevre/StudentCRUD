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
    firstName: "Marie",
    lastName: "Curie",
    email: "marie.curie@test.fr",
    grade: 20,
    field: "physique",
};

function postStudent(body: unknown) {
    return app.request("/students", {
        method: "POST",
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

describe("POST /students", () => {
    it("6. données valides doit renvoyer 201 et l'étudiant créé avec un ID", async () => {
        const res = await postStudent(validPayload);

        expect(res.status).toBe(201);

        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body).toHaveProperty("data");

        expect(body.data.id).toBe(6);

        expect(body.data.firstName).toBe(validPayload.firstName);
        expect(body.data.lastName).toBe(validPayload.lastName);
        expect(body.data.email).toBe(validPayload.email.toLowerCase());
        expect(body.data.grade).toBe(validPayload.grade);
        expect(body.data.field).toBe(validPayload.field);

        expect(vi.mocked(writeFileSync)).toHaveBeenCalledOnce();
    });

    it("7. champ obligatoire manquant doit renvoyer 400", async () => {
        const { lastName: _lastName, ...payloadSansNom } = validPayload;

        const res = await postStudent(payloadSansNom);

        expect(res.status).toBe(400);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body).toHaveProperty("errors");

        expect(body.errors).toHaveProperty("lastName");

        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });

    it("8. note invalide (ex: 25) doit renvoyer 400", async () => {
        const res = await postStudent({ ...validPayload, grade: 25 });

        expect(res.status).toBe(400);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body).toHaveProperty("errors");

        expect(body.errors).toHaveProperty("grade");

        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });

    it("9. email déjà existant doit renvoyer 409", async () => {
        const res = await postStudent({
            ...validPayload,
            email: testStudents[0].email,
        });

        expect(res.status).toBe(409);

        const body = await res.json();
        expect(body.success).toBe(false);

        expect(body.message).toContain(testStudents[0].email);

        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });
});
