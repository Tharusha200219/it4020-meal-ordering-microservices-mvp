const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('✅ Order Service is running! (Member 4 - Full CRUD)');
});

app.listen(PORT, () => {
  console.log(`🚀 Order Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`📄 Via Gateway: http://localhost:8000/swagger/order-service/api-docs`);
});