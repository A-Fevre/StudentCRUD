import { Hono } from "hono";
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
} from "../Contollers/student.controller";

const studentRoutes = new Hono();

studentRoutes.get("/", getAllStudents);
studentRoutes.get("/:id", getStudentById);
studentRoutes.post("/", createStudent);
studentRoutes.put("/:id", updateStudent);

export default studentRoutes;
