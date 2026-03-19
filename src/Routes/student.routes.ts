import { Hono } from "hono";
import { getAllStudents } from "../Contollers/student.controller";

const studentRoutes = new Hono();

studentRoutes.get("/", getAllStudents);

export default studentRoutes;
