require("dotenv").config();

const express = require("express");

const clientRoutes = require("./modules/client/client.routes");
const technicianRoutes = require("./modules/technician/technician.routes");
const orderRoutes = require("./modules/order/order.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const catalogRoutes = require("./modules/catalog-service/catalog.routes");
const assignmentRoutes = require("./modules/assignment/assignment.routes");
const paymentRoutes = require("./modules/payment/payment.routes");
const ratingRoutes = require("./modules/rating/rating.routes");
const complaintRoutes = require("./modules/complaint/complaint.routes");
const followUpRoutes = require("./modules/follow-up/followUp.routes");
const callRecordRoutes = require("./modules/call-center/callRecord.routes");
const swaggerSpec = require("./config/swagger");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
    });
});

app.use("/api/clients", clientRoutes);

app.use("/api/technicians", technicianRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/follow-ups", followUpRoutes);

app.use("/api/services", catalogRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/call-center", callRecordRoutes); 

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