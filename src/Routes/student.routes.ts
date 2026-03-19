import { Hono } from "hono";
import {
    getAllStudents,
    getStudentById,
    createStudent,
} from "../Contollers/student.controller";

const studentRoutes = new Hono();

studentRoutes.get("/", getAllStudents);
studentRoutes.get("/:id", getStudentById);
studentRoutes.post("/", createStudent);

export default studentRoutes;
