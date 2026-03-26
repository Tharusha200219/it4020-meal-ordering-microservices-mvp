const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Restaurant Service API',
            version: '1.0.0',
            description: 'Microservice for managing restaurants in the Meal Ordering System',
        },
        servers: [
            { url: 'http://localhost:8002' },
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
        },
        tags: [
            {
                name: 'Restaurants',
                description: 'Restaurant management APIs'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(swaggerOptions);