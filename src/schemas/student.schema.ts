import { z } from "zod";

export const FIELDS = [
    "informatique",
    "mathématiques",
    "physique",
    "chimie",
] as const;

export const StudentSchema = z.object({
    id: z
        .number()
        .int({ message: "L'identifiant doit être un entier" })
        .positive({ message: "L'identifiant doit être un entier positif" }),

    firstName: z
        .string({ error: "Le prénom est obligatoire" })
        .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
        .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" })
        .trim(),

    lastName: z
        .string({ error: "Le nom est obligatoire" })
        .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
        .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" })
        .trim(),

    email: z
        .string({ error: "L'email est obligatoire" })
        .email({ message: "L'adresse email n'est pas valide" })
        .toLowerCase()
        .trim(),

    grade: z
        .number({ error: "La note est obligatoire" })
        .min(0, { message: "La note ne peut pas être inférieure à 0" })
        .max(20, { message: "La note ne peut pas dépasser 20" }),

    field: z.enum(FIELDS, {
        error: () => ({
            message: `La filière doit être l'une des suivantes : ${FIELDS.join(", ")}`,
        }),
    }),
});

export const CreateStudentSchema = StudentSchema.omit({ id: true });

export const UpdateStudentSchema = StudentSchema.omit({ id: true }).partial();

export const StudentIdSchema = z.object({
    id: z.coerce
        .number({ message: "L'identifiant doit être un nombre" })
        .int({ message: "L'identifiant doit être un entier" })
        .positive({ message: "L'identifiant doit être un entier positif" }),
});

export const StudentQuerySchema = z.object({
    field: z.enum(FIELDS).optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    minGrade: z.coerce
        .number()
        .min(0, { message: "minGrade ne peut pas être inférieur à 0" })
        .max(20, { message: "minGrade ne peut pas dépasser 20" })
        .optional(),

    maxGrade: z.coerce
        .number()
        .min(0, { message: "maxGrade ne peut pas être inférieur à 0" })
        .max(20, { message: "maxGrade ne peut pas dépasser 20" })
        .optional(),
});

export type Student = z.infer<typeof StudentSchema>;
export type CreateStudentDto = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentDto = z.infer<typeof UpdateStudentSchema>;
export type StudentId = z.infer<typeof StudentIdSchema>;
export type StudentQuery = z.infer<typeof StudentQuerySchema>;
export type StudentField = z.infer<typeof StudentSchema.shape.field>;
