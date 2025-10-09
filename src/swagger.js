const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
        url: "http://localhost:4000/api", // đường dẫn base URL của API
      },
    ],
  },
  apis: ["./src/routes/*.js"], // nơi Swagger quét để tạo docs
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
