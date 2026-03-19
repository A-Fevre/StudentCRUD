import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import studentRoutes from "./Routes/student.routes";
import { openapiSpec } from "./openapi";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());

app.get("/openapi.json", (c) => c.json(openapiSpec));
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.get("/", (c) => {
    return c.json({
        success: true,
        message: "Student CRUD API",
        version: "1.0.0",
        endpoints: {
            getAll: "GET    /students",
        },
    });
});

app.route("/students", studentRoutes);

app.notFound((c) => {
    return c.json(
        {
            success: false,
            message: `La route "${c.req.method} ${c.req.path}" n'existe pas.`,
            hint: "Consultez GET / pour voir les endpoints disponibles.",
        },
        404,
    );
});

app.onError((err, c) => {
    console.error("[ERROR]", err);
    return c.json(
        {
            success: false,
            message: "Une erreur interne est survenue.",
        },
        500,
    );
});

console.log("🚀 Serveur démarré sur http://localhost:3000");

export default app;
