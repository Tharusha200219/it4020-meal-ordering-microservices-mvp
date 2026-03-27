const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { swaggerUi, swaggerDocs } = require('./swagger');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 8004;

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
