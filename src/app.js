require("dotenv").config();

const express = require("express");

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

app.get("/api-docs", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Fixawy API Docs</title>

            <link
                rel="stylesheet"
                href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
            />
        </head>

        <body>
            <div id="swagger-ui"></div>

            <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

            <script>
                window.onload = () => {
                    SwaggerUIBundle({
                        spec: ${JSON.stringify(swaggerSpec)},
                        dom_id: "#swagger-ui",
                        deepLinking: true
                    });
                };
            </script>
        </body>
        </html>
    `);
});

module.exports = app;