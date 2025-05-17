import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "../config/env";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking API",
      version: "1.0.0",
      description: "API for Vehicle Parking Management",
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};