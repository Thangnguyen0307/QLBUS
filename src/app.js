const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const config = require("./config");
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());
// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", routes);

mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
