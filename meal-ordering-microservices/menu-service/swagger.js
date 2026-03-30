const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Menu Service API',
      version: '1.0.0',
      description: 'Menu microservice for Meal Ordering System',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 8003}` },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(swaggerOptions);