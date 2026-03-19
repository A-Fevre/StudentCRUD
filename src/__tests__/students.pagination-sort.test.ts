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

describe("GET /students pagination & sort", () => {
    it("16. order=asc doit trier par grade croissant", async () => {
        const res = await app.request("/students?order=asc");
        expect(res.status).toBe(200);

        const body = await res.json();
        const grades = body.data.map((s: { grade: number }) => s.grade);
        const sorted = [...grades].sort((a, b) => a - b);
        expect(grades).toEqual(sorted);
    });

    it("17. order=desc doit trier par grade decroissant", async () => {
        const res = await app.request("/students?order=desc");
        expect(res.status).toBe(200);

        const body = await res.json();
        const grades = body.data.map((s: { grade: number }) => s.grade);
        const sorted = [...grades].sort((a, b) => b - a);
        expect(grades).toEqual(sorted);
    });

    it("18. page=2&limit=2 doit paginer correctement", async () => {
        const res = await app.request("/students?page=2&limit=2&order=desc");
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.data).toHaveLength(2);
        expect(body.pagination.page).toBe(2);
        expect(body.pagination.limit).toBe(2);
        expect(body.pagination.total).toBe(5);
        expect(body.pagination.totalPages).toBe(3);
        expect(body.pagination.hasPrev).toBe(true);
        expect(body.pagination.hasNext).toBe(true);
    });

    it("19. page invalide doit renvoyer 400", async () => {
        const res = await app.request("/students?page=0&limit=2");
        expect(res.status).toBe(400);
    });

    it("20. limit invalide doit renvoyer 400", async () => {
        const res = await app.request("/students?page=1&limit=-1");
        expect(res.status).toBe(400);
    });

    it("21. liste vide doit renvoyer pagination coherente", async () => {
        vi.mocked(readFileSync).mockReturnValue(JSON.stringify([]));
        const res = await app.request("/students");
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.data).toEqual([]);
        expect(body.pagination.total).toBe(0);
        expect(body.pagination.totalPages).toBe(0);
        expect(body.pagination.hasNext).toBe(false);
        expect(body.pagination.hasPrev).toBe(false);
    });

    it("23. page trop grande doit renvoyer une liste vide", async () => {
        const res = await app.request("/students?page=10&limit=2");
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.data).toEqual([]);
        expect(body.pagination.totalPages).toBe(3);
        expect(body.pagination.hasNext).toBe(false);
        expect(body.pagination.hasPrev).toBe(true);
    });

    it("24. page=1&limit=2 doit renvoyer les deux meilleures notes", async () => {
        const res = await app.request("/students?page=1&limit=2&order=desc");
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.data).toHaveLength(2);
        expect(body.data[0].grade).toBe(18.0);
        expect(body.data[1].grade).toBe(16.5);
    });
});
