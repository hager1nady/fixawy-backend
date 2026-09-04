require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const clientRoutes = require("./modules/client/client.routes");
const technicianRoutes = require("./modules/technician/technician.routes");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
    });
});

app.use("/api/clients", clientRoutes);
app.use("/api/technicians", technicianRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

module.exports = app;