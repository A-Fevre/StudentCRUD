export const openapiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Student CRUD API",
        version: "1.0.0",
        description:
            "API de gestion des etudiants. Inclut CRUD, recherche, stats, pagination et tri.",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
    tags: [
        { name: "Students", description: "Operations sur les etudiants" },
        { name: "Stats", description: "Statistiques" },
        { name: "Meta", description: "Meta / Health" },
    ],
    paths: {
        "/": {
            get: {
                tags: ["Meta"],
                summary: "Information API",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean" },
                                        message: { type: "string" },
                                        version: { type: "string" },
                                        endpoints: {
                                            type: "object",
                                            additionalProperties: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/students": {
            get: {
                tags: ["Students"],
                summary: "Lister les etudiants (pagine et trie)",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", minimum: 1, default: 1 },
                        description: "Numero de page",
                    },
                    {
                        name: "limit",
                        in: "query",
                        schema: { type: "integer", minimum: 1, default: 10 },
                        description: "Nombre d'elements par page",
                    },
                    {
                        name: "sort",
                        in: "query",
                        schema: { type: "string", enum: ["grade"], default: "grade" },
                        description: "Champ de tri (actuellement grade)",
                    },
                    {
                        name: "order",
                        in: "query",
                        schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
                        description: "Ordre de tri",
                    },
                ],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedStudentsResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Students"],
                summary: "Creer un etudiant",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateStudent" },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Created",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/StudentResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                    "409": {
                        description: "Conflict",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
        },
        "/students/{id}": {
            get: {
                tags: ["Students"],
                summary: "Recuperer un etudiant par id",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/StudentResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                    "404": {
                        description: "Not Found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Students"],
                summary: "Mettre a jour un etudiant",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateStudent" },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/StudentResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                    "404": {
                        description: "Not Found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                    "409": {
                        description: "Conflict",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Students"],
                summary: "Supprimer un etudiant",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/DeleteResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                    "404": {
                        description: "Not Found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
        },
        "/students/search": {
            get: {
                tags: ["Students"],
                summary: "Rechercher des etudiants par nom/prenom",
                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/StudentsResponse" },
                            },
                        },
                    },
                    "400": {
                        description: "Bad Request",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/ApiError" },
                            },
                        },
                    },
                },
            },
        },
        "/students/stats": {
            get: {
                tags: ["Stats"],
                summary: "Recuperer les statistiques",
                responses: {
                    "200": {
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/StatsResponse" },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Student: {
                type: "object",
                required: ["id", "firstName", "lastName", "email", "grade", "field"],
                properties: {
                    id: { type: "integer" },
                    firstName: { type: "string", minLength: 2, maxLength: 50 },
                    lastName: { type: "string", minLength: 2, maxLength: 50 },
                    email: { type: "string", format: "email" },
                    grade: { type: "number", minimum: 0, maximum: 20 },
                    field: {
                        type: "string",
                        enum: [
                            "informatique",
                            "mathématiques",
                            "physique",
                            "chimie",
                        ],
                    },
                },
            },
            CreateStudent: {
                type: "object",
                required: ["firstName", "lastName", "email", "grade", "field"],
                properties: {
                    firstName: { type: "string", minLength: 2, maxLength: 50 },
                    lastName: { type: "string", minLength: 2, maxLength: 50 },
                    email: { type: "string", format: "email" },
                    grade: { type: "number", minimum: 0, maximum: 20 },
                    field: {
                        type: "string",
                        enum: [
                            "informatique",
                            "mathématiques",
                            "physique",
                            "chimie",
                        ],
                    },
                },
            },
            ApiError: {
                type: "object",
                required: ["success", "message"],
                properties: {
                    success: { type: "boolean", enum: [false] },
                    message: { type: "string" },
                    errors: {
                        type: "object",
                        additionalProperties: {
                            type: "array",
                            items: { type: "string" },
                        },
                    },
                },
            },
            PaginationMeta: {
                type: "object",
                required: [
                    "page",
                    "limit",
                    "total",
                    "totalPages",
                    "hasNext",
                    "hasPrev",
                ],
                properties: {
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    hasNext: { type: "boolean" },
                    hasPrev: { type: "boolean" },
                },
            },
            StudentsResponse: {
                type: "object",
                required: ["success", "data"],
                properties: {
                    success: { type: "boolean", enum: [true] },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Student" },
                    },
                },
            },
            PaginatedStudentsResponse: {
                type: "object",
                required: ["success", "data", "pagination"],
                properties: {
                    success: { type: "boolean", enum: [true] },
                    data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Student" },
                    },
                    pagination: { $ref: "#/components/schemas/PaginationMeta" },
                },
            },
            StudentResponse: {
                type: "object",
                required: ["success", "data"],
                properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { $ref: "#/components/schemas/Student" },
                },
            },
            DeleteResponse: {
                type: "object",
                required: ["success", "data"],
                properties: {
                    success: { type: "boolean", enum: [true] },
                    data: {
                        type: "object",
                        required: ["message"],
                        properties: {
                            message: { type: "string" },
                        },
                    },
                },
            },
            StatsResponse: {
                type: "object",
                required: [
                    "totalStudents",
                    "averageGrade",
                    "studentsByField",
                    "bestStudent",
                ],
                properties: {
                    totalStudents: { type: "integer" },
                    averageGrade: { type: "number" },
                    studentsByField: {
                        type: "object",
                        additionalProperties: { type: "integer" },
                    },
                    bestStudent: {
                        anyOf: [
                            { $ref: "#/components/schemas/Student" },
                            { type: "null" },
                        ],
                    },
                },
            },
        },
    },
} as const;
