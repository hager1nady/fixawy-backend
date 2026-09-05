const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fixawy API",
      version: "1.0.0",
      description: "Fixawy Backend API",
    },
    servers: [
      {
        url: "https://fixawy-backend.vercel.app",
      },
    ],
  },

  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;