const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/menus', require('./routes/menuRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '✅ Menu Service is running on port ' + PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Menu Service running on port ${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
});