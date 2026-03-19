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

beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(testStudents));
    vi.mocked(writeFileSync).mockImplementation(() => undefined);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe("GET /students", () => {
    it("1. doit renvoyer le statut 200 et un tableau", async () => {
        const res = await app.request("/students");

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body).toHaveProperty("data");
        expect(Array.isArray(body.data)).toBe(true);
    });

    it("2. doit renvoyer tous les étudiants de la fixture (5 étudiants)", async () => {
        const res = await app.request("/students");
        const body = await res.json();

        expect(body.data).toHaveLength(testStudents.length);

        const expectedSorted = [...testStudents].sort(
            (a, b) => b.grade - a.grade,
        );

        expectedSorted.forEach((expected, index) => {
            expect(body.data[index].id).toBe(expected.id);
            expect(body.data[index].firstName).toBe(expected.firstName);
            expect(body.data[index].lastName).toBe(expected.lastName);
            expect(body.data[index].email).toBe(expected.email);
            expect(body.data[index].grade).toBe(expected.grade);
            expect(body.data[index].field).toBe(expected.field);
        });
    });
});

describe("GET /students/:id", () => {
    it("3. id valide doit renvoyer le statut 200 et l'étudiant correspondant", async () => {
        const res = await app.request("/students/1");

        expect(res.status).toBe(500);

        const body = await res.json();
        expect(body).toHaveProperty("data");
        expect(body.data.id).toBe(1);
        expect(body.data.firstName).toBe("Lucas");
        expect(body.data.lastName).toBe("Martin");
        expect(body.data.email).toBe("lucas.martin@test.fr");
        expect(body.data.grade).toBe(14.5);
        expect(body.data.field).toBe("informatique");
    });

    it("4. id inexistant doit renvoyer le statut 404", async () => {
        const res = await app.request("/students/999");

        expect(res.status).toBe(404);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("999");
    });

    it("5. id invalide (ex: 'abc') doit renvoyer le statut 400", async () => {
        const res = await app.request("/students/abc");

        expect(res.status).toBe(400);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(typeof body.message).toBe("string");
    });
});
