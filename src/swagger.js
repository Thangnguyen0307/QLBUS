// src/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const baseUrl = process.env.RENDER_EXTERNAL_URL || "http://localhost:4000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QL Xe Bus API",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống Quản lý Xe Bus 🚍",
    },
    servers: [
      {
        url: `${baseUrl}/api`, // đường dẫn base URL của API
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "docs/*.swagger.js")], // nơi Swagger quét để tạo docs
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
