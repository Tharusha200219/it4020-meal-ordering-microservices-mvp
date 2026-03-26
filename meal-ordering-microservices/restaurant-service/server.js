const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// Root route for health check
app.get('/', (req, res) => {
    res.json({ message: 'Restaurant Service is running' });
});

app.listen(PORT, () => {
    console.log(`✅ Restaurant Service running on port ${PORT}`);
});