import { Hono } from "hono";
import {
    getAllStudents,
    getStudentById,
} from "../Contollers/student.controller";

const studentRoutes = new Hono();

studentRoutes.get("/", getAllStudents);
studentRoutes.get("/:id", getStudentById);

export default studentRoutes;
