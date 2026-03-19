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

function deleteStudent(id: number | string) {
    return app.request(`/students/${id}`, {
        method: "DELETE",
    });
}

beforeEach(() => {
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(testStudents));
    vi.mocked(writeFileSync).mockImplementation(() => undefined);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe("DELETE /students/:id", () => {
    it("12. ID valide doit renvoyer 200 et un message de confirmation", async () => {
        const res = await deleteStudent(1);

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body.success).toBe(true);
        expect(body.data.message).toContain("1");
        expect(vi.mocked(writeFileSync)).toHaveBeenCalledOnce();
    });

    it("13. ID inexistant doit renvoyer 404", async () => {
        const res = await deleteStudent(999);

        expect(res.status).toBe(404);

        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.message).toContain("999");
        expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled();
    });
});
