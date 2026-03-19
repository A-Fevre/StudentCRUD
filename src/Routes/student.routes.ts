import { Hono } from "hono";
import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
    searchStudents,
} from "../Contollers/student.controller";

const studentRoutes = new Hono();

studentRoutes.get("/", getAllStudents);
studentRoutes.get("/stats", getStudentStats);
studentRoutes.get("/search", searchStudents);
studentRoutes.get("/:id", getStudentById);
studentRoutes.post("/", createStudent);
studentRoutes.put("/:id", updateStudent);
studentRoutes.delete("/:id", deleteStudent);

export default studentRoutes;
