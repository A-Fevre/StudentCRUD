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

describe("GET /students/stats", () => {
    it("14. doit renvoyer totalStudents, averageGrade, studentsByField, bestStudent", async () => {
        const res = await app.request("/students/stats");

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body).toHaveProperty("totalStudents");
        expect(body.totalStudents).toBe(testStudents.length);

        expect(body).toHaveProperty("averageGrade");
        const expectedAverage =
            Math.round(
                (testStudents.reduce((sum, s) => sum + s.grade, 0) /
                    testStudents.length) *
                    100,
            ) / 100;
        expect(body.averageGrade).toBe(expectedAverage);

        expect(body).toHaveProperty("studentsByField");
        expect(body.studentsByField).toMatchObject({
            informatique: 2,
            mathématiques: 1,
            physique: 1,
            chimie: 1,
        });

        expect(body).toHaveProperty("bestStudent");
        expect(body.bestStudent.id).toBe(2);
        expect(body.bestStudent.grade).toBe(18.0);
    });
});

describe("GET /students/search", () => {
    it("15. ?q=... doit renvoyer les étudiants dont le nom ou prénom correspond", async () => {
        const res = await app.request("/students/search?q=em");

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data).toHaveLength(1);
        expect(body.data[0].firstName).toBe("Emma");

        const resLastName = await app.request("/students/search?q=mar");
        const bodyLastName = await resLastName.json();
        expect(bodyLastName.data).toHaveLength(1);
        expect(bodyLastName.data[0].lastName).toBe("Martin");

        const resCaseInsensitive = await app.request("/students/search?q=LUCAS");
        const bodyCaseInsensitive = await resCaseInsensitive.json();
        expect(bodyCaseInsensitive.data).toHaveLength(1);
        expect(bodyCaseInsensitive.data[0].firstName).toBe("Lucas");

        const resEmpty = await app.request("/students/search");
        expect(resEmpty.status).toBe(400);
    });
});
