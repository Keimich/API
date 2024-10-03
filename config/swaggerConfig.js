const swaggerJSDoc = require("swagger-jsdoc");
require('dotenv').config();

const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "API Node.js + Express + JWT",
    version: "1.0.0",
    description: "Documentação da API",
  },
  servers: [
    {
      url: `${process.env.APP_URL}/api`,
      description: "Development server",
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
};

const options = {
  swaggerDefinition,
  apis: ["../src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
