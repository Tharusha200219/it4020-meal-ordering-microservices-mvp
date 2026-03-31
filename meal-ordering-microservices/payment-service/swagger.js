const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Payment Service API",
    version: "1.0.0",
    description: "API for managing payments in the Meal Ordering System",
  },
  servers: [
    {
      url: "http://localhost:8005",
      description: "Local Development Server",
    },
    {
      url: "http://localhost:8000",
      description: "API Gateway",
    }
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
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./server.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
