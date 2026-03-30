const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'Order Service for Meal Ordering System (Member 4) - Full CRUD'
    },
    servers: [
      { url: 'http://localhost:8004' },
      { url: 'http://localhost:8000' }
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
  apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions);