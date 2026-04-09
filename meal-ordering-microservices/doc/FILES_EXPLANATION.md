# File Structure & Purpose Documentation

Complete breakdown of every file in API Gateway, User Service, and Payment Service.

---

## 🏠 API GATEWAY SERVICE

### Service Overview
Central routing hub that receives all client requests and forwards them to appropriate microservices.

**Port**: 8000

---

### 📄 API Gateway Files Breakdown

#### 1. `server.js` - Main Application Server
**Location**: `api-gateway/server.js`

**Purpose**: Entry point of the API Gateway service

**What it does**:
- Loads environment variables using `dotenv`
- Creates Express.js application instance
- Configures middleware (CORS, JSON parsing)
- Sets up Swagger documentation UI
- Defines root endpoints (`/` and `/health`)
- Registers all proxy routes for routing to services
- Handles 404 and error scenarios
- Starts the server on port 8000

**Key Code Sections**:
```javascript
// Load environment variables
require("dotenv").config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint - says gateway is running
app.get("/", (req, res) => {
  res.json({ message: "Meal Ordering API Gateway is running!" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is running" });
});

// Forward all other requests to proxy routes
app.use("/", proxyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start listening
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

**Dependencies Used**:
- `express` - Web framework
- `cors` - Cross-origin support
- `swagger-ui-express` - Display Swagger docs
- `dotenv` - Load .env variables

**Endpoints Provided**:
- `GET /` - Root endpoint (public)
- `GET /health` - Health check (public)
- `GET /api-docs` - Swagger documentation (public)
- All other routes → forwarded to proxy routes file

**File Type**: JavaScript (Node.js executable)

---

#### 2. `swagger.js` - API Documentation Configuration
**Location**: `api-gateway/swagger.js`

**Purpose**: Configure OpenAPI/Swagger documentation for API Gateway

**What it does**:
- Defines Swagger/OpenAPI specification version (3.0.0)
- Sets API title, version, and description
- Specifies server URL (localhost:8000)
- Defines security scheme (JWT Bearer token)
- Points to routes file for endpoint documentation

**Key Code Sections**:
```javascript
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",  // OpenAPI version
    info: {
      title: "Meal Ordering Microservices API Gateway",
      version: "1.0.0",
      description: "API Gateway - Routes to all microservices"
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "API Gateway"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: [path.join(__dirname, "./routes/proxyRoutes.js")]  // Read comments from routes file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
```

**What It Generates**:
- Interactive API documentation UI at `http://localhost:8000/api-docs`
- Swagger JSON file at `http://localhost:8000/api-docs/swagger.json`
- Allows developers to test endpoints directly from browser

**File Type**: Configuration file (JavaScript)

---

#### 3. `routes/proxyRoutes.js` - Request Routing Logic
**Location**: `api-gateway/routes/proxyRoutes.js`

**Purpose**: Route incoming requests to appropriate microservices

**What it does**:
- Creates Express router
- Defines routing patterns for each microservice
- Forwards HTTP requests to correct service port
- Uses axios for making HTTP requests to services
- Includes Swagger JSDoc comments for documentation

**Key Routing Logic**:
```javascript
const router = express.Router();
const axios = require("axios");

// Example logic (actual file has more routes):
// /api/users/* → forward to User Service (port 8001)
// /api/payments/* → forward to Payment Service (port 8005)
// /api/orders/* → forward to Order Service (port 8004)
// /api/menu/* → forward to Menu Service (port 8003)
// /api/restaurants/* → forward to Restaurant Service (port 8002)

// Typical proxy pattern:
router.post("/api/users/register", async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8001/api/users/register",
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500)
       .json(error.response?.data || { error: "Service unavailable" });
  }
});
```

**Services Routed To**:
- Port 8001 - User Service (`/api/users/*`)
- Port 8002 - Restaurant Service (`/api/restaurants/*`)
- Port 8003 - Menu Service (`/api/menu/*`)
- Port 8004 - Order Service (`/api/orders/*`)
- Port 8005 - Payment Service (`/api/payments/*`)

**How Request Flows**:
1. Client → `POST http://localhost:8000/api/users/login`
2. API Gateway receives request
3. Recognizes `/api/users/` pattern
4. Forwards to → `POST http://localhost:8001/api/users/login`
5. User Service processes and returns response
6. API Gateway forwards response back to client

**File Type**: Routes definition (JavaScript)

---

#### 4. `package.json` - Project Dependencies
**Location**: `api-gateway/package.json`

**Purpose**: Node.js project configuration and dependency management

**What it defines**:
- Project name: `api-gateway`
- Project version: `1.0.0`
- Entry point: `server.js`
- NPM scripts for running the service
- List of required dependencies

**Key Content**:
```json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "description": "API Gateway for meal ordering microservices",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",      // Start production
    "dev": "node server.js"         // Start development
  },
  "dependencies": {
    "express": "^4.18.2",                    // Web framework
    "cors": "^2.8.5",                        // Cross-origin support
    "dotenv": "^16.3.1",                     // Environment variables
    "axios": "^1.13.6",                      // HTTP client
    "swagger-jsdoc": "^6.2.8",               // Swagger generation
    "swagger-ui-express": "^5.0.0",          // Swagger UI
    "http-proxy-middleware": "^2.0.6"        // Request proxying
  }
}
```

**How to Use**:
```bash
npm install              # Install all dependencies
npm start                # Start the gateway
```

**File Type**: Configuration (JSON)

---

#### 5. `.env` & `.env.example` - Environment Configuration
**Location**: `api-gateway/.env` and `api-gateway/.env.example`

**Purpose**: Store sensitive configuration and environment variables

**.env.example** (template):
```
PORT=8000
JWT_SECRET=your_jwt_secret_key
```

**.env** (actual - DO NOT commit):
```
PORT=8000
JWT_SECRET=your_actual_secret_key
```

**Used By**: `server.js` loads PORT from this file

**File Type**: Configuration (text)

---

#### 6. `node_modules/` - Installed Dependencies
**Location**: `api-gateway/node_modules/`

**Purpose**: Directory containing all installed npm packages

**What's in here**:
- All packages listed in `package.json`
- All dependencies of those packages
- Third-party libraries

**Note**: 
- NOT committed to Git (too large)
- Created by `npm install`
- Delete and reinstall with `rm -rf node_modules && npm install`

**File Type**: Directory (auto-generated)

---

#### 7. `package-lock.json` - Dependency Lock File
**Location**: `api-gateway/package-lock.json`

**Purpose**: Lock exact versions of dependencies

**What it does**:
- Records exact version of every installed package
- Ensures consistent installs across different computers
- Prevents version mismatches

**When Used**:
```bash
npm install              # Uses package-lock.json to install exact versions
npm update               # Updates versions (regenerates package-lock.json)
```

**File Type**: Lock file (JSON)

---

## 👤 USER SERVICE

### Service Overview
Handles all user-related operations: registration, authentication, profile management.

**Port**: 8001

---

### 📄 User Service Files Breakdown

#### 1. `server.js` - User Service Entry Point
**Location**: `user-service/server.js`

**Purpose**: Initialize and start the User Service

**What it does**:
- Loads environment variables
- Creates Express application
- Configures middleware (CORS, JSON parsing)
- Sets up Swagger documentation
- Registers user routes at `/api/users`
- Defines root and health check endpoints
- Handles 404 responses
- Starts server on port 8001

**Key Code**:
```javascript
require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 8001;  // Port 8001 for User Service

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes at /api/users
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "User Service is running" });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
```

**Key Differences from API Gateway**:
- Uses `userRoutes` instead of `proxyRoutes`
- Actually processes requests instead of forwarding
- Runs on port 8001 (internal)

**Endpoints**:
- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**File Type**: Executable JavaScript

---

#### 2. `swagger.js` - User Service Documentation
**Location**: `user-service/swagger.js`

**Purpose**: Configure Swagger/OpenAPI documentation for User Service

**What it does**:
- Defines OpenAPI 3.0.0 specification
- Sets title: "User Service API"
- Specifies server: `http://localhost:8001`
- Configures JWT Bearer authentication
- Points to routes files for endpoint definitions

**Key Code**:
```javascript
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "User service for Meal Ordering Microservices MVP",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:8001",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"]  // Read JSDoc comments from route files
};
```

**Generates**: Interactive API docs at `http://localhost:8001/api-docs`

**File Type**: Configuration (JavaScript)

---

#### 3. `routes/userRoutes.js` - User Endpoints Definition
**Location**: `user-service/routes/userRoutes.js`

**Purpose**: Define all user-related API endpoints

**What it does**:
- Creates Express router
- Imports controller functions
- Imports authentication middleware
- Defines route patterns
- Applies middleware to protected routes
- Includes Swagger JSDoc documentation

**Route Definitions**:
```javascript
const router = express.Router();
const { register, login, getMe, getUserById, updateUserById, 
        deleteUserById, getAllUsersHandler } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

// Public endpoints (no authentication required)
router.post("/register", register);           // Create new user
router.post("/login", login);                 // User login

// Protected endpoints (JWT required)
router.get("/me", verifyToken, getMe);                          // Current user
router.get("/", verifyToken, getAllUsersHandler);               // All users
router.get("/:id", verifyToken, getUserById);                   // User by ID
router.put("/:id", verifyToken, updateUserById);                // Update user
router.delete("/:id", verifyToken, deleteUserById);             // Delete user

module.exports = router;
```

**Swagger Documentation**: Each route has @swagger comments describing:
- Endpoint path and method
- Required parameters
- Request body schema
- Response codes and formats
- Authentication requirements

**Request Flow**:
```
Client Request
    ↓
Routes file matches pattern
    ↓
Applies middleware (e.g., verifyToken)
    ↓
Calls controller function
    ↓
Controller processes and responds
```

**File Type**: Routes definition (JavaScript)

---

#### 4. `controllers/userController.js` - Business Logic
**Location**: `user-service/controllers/userController.js`

**Purpose**: Handle user registration, authentication, and profile management logic

**What it does**:
- Implements all user-related operations
- Validates user input
- Calls database/model functions to store/retrieve data
- Generates JWT tokens for authentication
- Returns appropriate HTTP responses
- Handles errors and edge cases

**Functions Exported**:
```javascript
register(req, res)          // Create new user account
login(req, res)             // Authenticate user, generate token
getMe(req, res)             // Get current logged-in user
getUserById(req, res)       // Get specific user
updateUserById(req, res)    // Update user profile
deleteUserById(req, res)    // Delete user account
getAllUsersHandler(req, res) // Get all users (admin)
```

**Example: Register Function Logic**:
```javascript
const register = (req, res) => {
  // 1. Extract data from request
  const { name, email, password, phone, address } = req.body;

  // 2. Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: "name, email, and password are required" 
    });
  }

  // 3. Check if email already exists (query database)
  if (findUserByEmail(email)) {
    return res.status(409).json({ 
      error: "Email already registered" 
    });
  }

  // 4. Create user in database
  const user = createUser(name, email, password, phone || "", address || "");

  // 5. Return success response
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user.id,
    user: getUserForResponse(user)
  });
};
```

**Example: Login Function Logic**:
```javascript
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      error: "email and password are required" 
    });
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ 
      error: "Invalid email or password" 
    });
  }

  // Verify password
  if (user.password !== password) {
    return res.status(401).json({ 
      error: "Invalid email or password" 
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  // Return token and user data
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: getUserForResponse(user)
  });
};
```

**Key Operations**:
- ✓ Input validation
- ✓ Database queries (findUserByEmail, findUserById, etc.)
- ✓ JWT token generation
- ✓ Password verification
- ✓ Authorization checks (admin, ownership)
- ✓ Error handling

**File Type**: Business logic (JavaScript)

---

#### 5. `middleware/auth.js` - JWT Authentication
**Location**: `user-service/middleware/auth.js`

**Purpose**: Verify JWT tokens for protected routes

**What it does**:
- Extracts JWT token from Authorization header
- Verifies token signature using JWT_SECRET
- Decodes token to get user information
- Attaches user data to request object
- Blocks request if token is invalid/missing

**Code**:
```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Extract token from "Bearer <token>" format
  const token = req.headers.authorization?.split(" ")[1];

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // 3. Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user to request
    req.user = decoded;  // Now controller can access req.user
    
    // 5. Continue to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };
```

**How It's Used in Routes**:
```javascript
// Protected route - verifyToken middleware runs first
router.get("/me", verifyToken, getMe);
           ↑          ↑           ↑
      endpoint    middleware   controller

// Flow:
// 1. Request arrives
// 2. verifyToken runs (checks if req.user is valid)
// 3. If valid: continue to getMe
// 4. If invalid: return 401 error (never reach getMe)
```

**Token Verification Process**:
```
Request with header:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  ↓

Extract token from "Bearer <token>"

  ↓

Verify with JWT_SECRET

  ↓

Valid? → Decode and attach to req.user → Continue
Invalid? → Return 401 Unauthorized
```

**File Type**: Middleware (JavaScript)

---

#### 6. `models/data.js` - In-Memory Database
**Location**: `user-service/models/data.js`

**Purpose**: Store and manage user data in memory

**What it does**:
- Maintains array of user objects
- Provides functions to query/modify users
- Generates auto-incrementing user IDs
- Hides database implementation from controllers

**Data Structure**:
```javascript
let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin",
    phone: "1234567890",
    address: "System Admin Address",
    role: "admin"
  }
];

let userIdCounter = 2;  // For auto-incrementing IDs
```

**Functions Exported**:
```javascript
// Query functions
findUserByEmail(email)      // Find user by email
findUserById(id)            // Find user by ID
getAllUsers()               // Get all users

// Modification functions
createUser(name, email, password, phone, address)  // Add new user
updateUser(id, updateData)                         // Update user
deleteUser(id)                                     // Remove user

// Utility functions
getUserForResponse(user)    // Remove password from user object
```

**Example: Create User Function**:
```javascript
const createUser = (name, email, password, phone, address) => {
  const user = {
    id: userIdCounter++,      // Auto-increment ID
    name,
    email,
    password,
    phone,
    address,
    role: "user"
  };
  users.push(user);  // Add to in-memory array
  return user;
};
```

**Important Note**:
- ⚠️ Data is stored in RAM only
- ⚠️ Data is LOST when server restarts
- ✓ Good for MVP/testing
- ✗ Not suitable for production

**File Type**: Data model/repository (JavaScript)

---

#### 7. `package.json` - Dependencies
**Location**: `user-service/package.json`

**Purpose**: Project configuration and dependencies

**Key Content**:
```json
{
  "name": "user-service",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.2.1",           // Web framework
    "cors": "^2.8.6",              // CORS support
    "dotenv": "^17.3.1",           // Environment variables
    "jsonwebtoken": "^9.0.3",      // JWT generation/verification
    "swagger-jsdoc": "^6.2.8",     // Swagger generation
    "swagger-ui-express": "^5.0.1" // Swagger UI
  }
}
```

**Key Packages**:
- `jsonwebtoken` - Used in middleware/auth.js and controllers
- `swagger-jsdoc` - Used in swagger.js for documentation
- `express` - Web framework used in server.js and routes

**File Type**: Configuration (JSON)

---

#### 8. `.env` & `.env.example` - Configuration
**Location**: `user-service/.env` and `.env.example`

**Template (.env.example)**:
```
PORT=8001
JWT_SECRET=your_jwt_secret_key
```

**Actual (.env - NOT committed)**:
```
PORT=8001
JWT_SECRET=super_secret_key_change_in_production
```

**Used By**: 
- `server.js` loads PORT
- `middleware/auth.js` loads JWT_SECRET for token verification
- `controllers/userController.js` loads JWT_SECRET for token generation

**File Type**: Configuration (text)

---

## 💳 PAYMENT SERVICE

### Service Overview
Handles payment processing and tracking for orders. Communicates with Order Service.

**Port**: 8005

---

### 📄 Payment Service Files Breakdown

#### 1. `server.js` - Payment Service Entry Point
**Location**: `payment-service/server.js`

**Purpose**: Initialize and start the Payment Service

**What it does**:
- Loads environment variables
- Creates Express application
- Configures middleware (CORS, JSON parsing)
- Sets up Swagger documentation
- Registers payment routes
- Defines root and health endpoints
- Starts server on port 8005

**Key Code**:
```javascript
require("dotenv").config();
const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register payment routes
app.use("/api/payments", paymentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Payment Service is up and running" });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Payment Service is running" });
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
```

**Main Endpoints**:
- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation
- `POST /api/payments` - Create payment
- `GET /api/payments` - List all payments
- `GET /api/payments/:id` - Get specific payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

**Port**: 8005 (internal service, not directly accessed by clients)

**File Type**: Executable JavaScript

---

#### 2. `swagger.js` - Payment Service Documentation
**Location**: `payment-service/swagger.js`

**Purpose**: Configure OpenAPI documentation for Payment Service

**What it does**:
- Defines OpenAPI 3.0.0 specifications
- Sets title: "Payment Service API"
- Specifies two servers (direct and via gateway)
- Configures JWT Bearer authentication
- Points to routes files for endpoint definitions

**Key Code**:
```javascript
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Payment Service API",
    version: "1.0.0",
    description: "API for managing payments in the Meal Ordering System"
  },
  servers: [
    {
      url: "http://localhost:8005",
      description: "Local Development Server (direct)"
    },
    {
      url: "http://localhost:8000",
      description: "API Gateway"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
```

**Documentation Access**:
- Direct: `http://localhost:8005/api-docs`
- Via Gateway: `http://localhost:8000/api-docs` (also documents all services)

**File Type**: Configuration (JavaScript)

---

#### 3. `routes/paymentRoutes.js` - Payment Endpoints
**Location**: `payment-service/routes/paymentRoutes.js`

**Purpose**: Define all payment-related API endpoints

**What it does**:
- Creates Express router
- Imports controller functions
- Imports authentication middleware
- Defines route patterns
- Applies authentication to all routes
- Maps HTTP methods to controller functions

**Route Definitions**:
```javascript
const express = require('express');
const {
  processPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication (authMiddleware)
router.post('/', authMiddleware, processPayment);      // Create payment
router.get('/', authMiddleware, getAllPayments);       // List payments
router.get('/:id', authMiddleware, getPaymentById);    // Get payment
router.put('/:id', authMiddleware, updatePayment);     // Update payment
router.delete('/:id', authMiddleware, deletePayment);  // Delete payment

module.exports = router;
```

**Route Pattern**:
```
POST   /api/payments          → Create new payment
GET    /api/payments          → List all payments
GET    /api/payments/:id      → Get specific payment (e.g., /payments/1)
PUT    /api/payments/:id      → Update payment (e.g., /payments/1)
DELETE /api/payments/:id      → Delete payment (e.g., /payments/1)
```

**Authentication**: All routes require valid JWT token

**Request Flow**:
```
Client Request
    ↓
Port 8000 (API Gateway) or 8005 (direct)
    ↓
Match route pattern
    ↓
authMiddleware runs (verify JWT)
    ↓
Controller function executes
    ↓
Response sent back
```

**File Type**: Routes definition (JavaScript)

---

#### 4. `controllers/paymentController.js` - Payment Logic
**Location**: `payment-service/controllers/paymentController.js`

**Purpose**: Handle payment processing and management

**What it does**:
- Validates payment requests
- Calls Order Service to verify orders
- Creates/updates/deletes payments
- Manages payment status
- Handles errors and edge cases

**Functions Exported**:
```javascript
processPayment(req, res)     // Create and process new payment
getAllPayments(req, res)     // Return all payments
getPaymentById(req, res)     // Return specific payment
updatePayment(req, res)      // Update payment details
deletePayment(req, res)      // Remove payment record
```

**Example: Process Payment Function**:
```javascript
const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;

    // 1. Validate input
    if (!order_id || !payment_method) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id and payment_method are required' 
      });
    }

    // 2. Validate payment method
    const validMethods = ['card', 'cash', 'online'];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment_method. Allowed: card, cash, online' 
      });
    }

    // 3. Call Order Service to verify order exists
    const config = {
      headers: { Authorization: req.headers.authorization }
    };

    let orderResponse;
    try {
      // Service-to-Service Communication
      orderResponse = await axios.get(
        `http://localhost:8004/api/orders/${order_id}`,
        config
      );
    } catch (error) {
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }
    }

    // 4. Verify order is pending
    const orderData = orderResponse.data.order || orderResponse.data;
    if (orderData.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot process payment for order with status '${orderData.status}'` 
      });
    }

    // 5. Create payment record
    const amount = orderData.total_price || 0;
    const newPayment = {
      id: payments.length + 1,
      order_id: parseInt(order_id),
      amount: amount,
      payment_method: payment_method,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    payments.push(newPayment);

    // 6. Return success response
    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment: newPayment
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
```

**Key Features**:
- ✓ Validates payment method (card, cash, online)
- ✓ Calls Order Service to verify order
- ✓ Checks order status is "pending"
- ✓ Extracts payment amount from order
- ✓ Stores payment in database
- ✓ Returns created payment

**Service Integration**:
```
Payment Service
    ↓ (needs order info)
Order Service (port 8004)
    ↓ (returns order details)
Payment Service (creates payment)
```

**File Type**: Business logic (JavaScript)

---

#### 5. `middleware/auth.js` - JWT Authentication
**Location**: `payment-service/middleware/auth.js`

**Purpose**: Verify JWT tokens for protected payment endpoints

**What it does**:
- Checks Authorization header
- Extracts Bearer token
- Verifies token signature
- Blocks request if unauthorized
- Attaches user to request if valid

**Code**:
```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Get authorization header
    const authHeader = req.headers.authorization;
    
    // 2. Check header format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // 3. Extract token
    const token = authHeader.split(' ')[1];
    
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach user to request
    req.user = decoded;
    
    // 6. Continue to next middleware/controller
    next();
    
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};
```

**Token Verification**: 
- ✓ Valid JWT → continue to controller
- ✗ Missing token → return 401
- ✗ Invalid token → return 401
- ✗ Expired token → return 401

**Usage in Routes**:
```javascript
// All payment routes wrapped with authMiddleware
router.post('/', authMiddleware, processPayment);
// Without token: 401 Unauthorized
// With token: Payment processing executes
```

**File Type**: Middleware (JavaScript)

---

#### 6. `models/data.js` - In-Memory Payment Storage
**Location**: `payment-service/models/data.js`

**Purpose**: Store payment records in memory

**What it does**:
- Maintains array of payment objects
- Exported as simple array (not functions like User Service)
- Controllers access and modify directly

**Code**:
```javascript
let payments = [];

module.exports = payments;
```

**Usage in Controller**:
```javascript
// In paymentController.js
const payments = require('../models/data');

// Create payment
const newPayment = {
  id: payments.length + 1,
  order_id: 5,
  amount: 49.99,
  payment_method: 'card',
  status: 'completed',
  created_at: new Date().toISOString()
};
payments.push(newPayment);  // Add to array

// Get all payments
payments;  // Returns entire array

// Get specific payment
payments.find(p => p.id === 1);

// Update payment
const index = payments.findIndex(p => p.id === 1);
payments[index] = { ...payments[index], status: 'failed' };

// Delete payment
payments.splice(index, 1);
```

**Data Structure**:
```javascript
payments = [
  {
    id: 1,
    order_id: 5,
    amount: 49.99,
    payment_method: 'card',
    status: 'completed',
    created_at: '2026-04-08T10:30:00.000Z'
  },
  {
    id: 2,
    order_id: 6,
    amount: 35.50,
    payment_method: 'online',
    status: 'completed',
    created_at: '2026-04-08T10:45:00.000Z'
  }
]
```

**Important**:
- ⚠️ Data lost on server restart
- ⚠️ No persistence
- ✓ Simple for MVP

**File Type**: Data storage (JavaScript)

---

#### 7. `package.json` - Dependencies
**Location**: `payment-service/package.json`

**Purpose**: Project configuration and package management

**Key Content**:
```json
{
  "name": "payment-service",
  "version": "1.0.0",
  "description": "Payment Service for Meal Ordering MVP",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.19.2",           // Web framework
    "cors": "^2.8.5",               // CORS support
    "dotenv": "^16.4.5",            // Environment variables
    "jsonwebtoken": "^9.0.2",       // JWT verification
    "axios": "^1.6.8",              // HTTP client (calls Order Service)
    "swagger-jsdoc": "^6.2.8",      // Swagger generation
    "swagger-ui-express": "^5.0.0"  // Swagger UI
  },
  "devDependencies": {
    "nodemon": "^3.1.0"  // Auto-restart on file changes (dev only)
  }
}
```

**Key Packages**:
- `axios` - Used to call Order Service in processPayment
- `jsonwebtoken` - Used in auth middleware for token verification
- `nodemon` - Useful for development (auto-restart)

**Scripts**:
```bash
npm start    # Production: node server.js
npm run dev  # Development: nodemon server.js (auto-restart)
```

**File Type**: Configuration (JSON)

---

#### 8. `.env` & `.env.example` - Configuration
**Location**: `payment-service/.env` and `.env.example`

**Template (.env.example)**:
```
PORT=8005
JWT_SECRET=your_jwt_secret_key
```

**Actual (.env - NOT committed)**:
```
PORT=8005
JWT_SECRET=same_secret_as_user_service
```

**Important**: 
- JWT_SECRET must be SAME across all services for token verification to work
- Used by auth middleware in `middleware/auth.js`
- Used when forarding requests to Order Service

**File Type**: Configuration (text)

---

## 📊 File Type Summary Table

| File Type | Purpose | Count |
|-----------|---------|-------|
| `server.js` | Application entry point | 3 |
| `swagger.js` | API documentation config | 3 |
| `routes/*.js` | Endpoint definitions | 3 |
| `controllers/*.js` | Business logic | 2 |
| `middleware/*.js` | JWT authentication | 2 |
| `models/*.js` | Data storage | 2 |
| `package.json` | Dependencies | 3 |
| `.env` | Configuration (secret) | 3 |
| `.env.example` | Configuration template | 3 |
| `node_modules/` | Installed packages | 3 |
| `package-lock.json` | Dependency lock | 3 |

---

## 🔄 Data Flow Through Services

### Example: User Registers and Makes Payment

```
1. USER REGISTRATION
   ├─ Client → http://localhost:8000/api/users/register (API Gateway)
   ├─ server.js routes to proxyRoutes.js
   ├─ proxyRoutes.js forwards to http://localhost:8001/api/users/register
   ├─ User Service server.js routes to userRoutes.js
   ├─ userRoutes.js calls register() controller
   ├─ register() validates, calls createUser() from models/data.js
   ├─ models/data.js adds user to in-memory users array
   └─ Response: 201 Created with user ID and JWT token

2. USER LOGIN
   ├─ Client → http://localhost:8000/api/users/login
   ├─ API Gateway → User Service (8001)
   ├─ userRoutes.js calls login() controller
   ├─ login() validates password, calls jwt.sign()
   └─ Returns JWT token

3. PROCESS PAYMENT
   ├─ Client → http://localhost:8000/api/payments (with JWT token)
   ├─ API Gateway → Payment Service (8005)
   ├─ paymentRoutes.js applies authMiddleware (verifies JWT)
   ├─ paymentRoutes.js calls processPayment() controller
   ├─ processPayment() calls Order Service
   │  ├─ axios.get(http://localhost:8004/api/orders/:id)
   │  └─ Order Service validates and returns order
   ├─ processPayment() creates payment object
   ├─ models/data.js adds payment to payments array
   └─ Returns: 201 Created with payment record
```

---

## 🎯 Key Concepts

### Middleware Chain
```
Request → Middleware 1 → Middleware 2 → Controller → Response
               ↓             ↓
         CORS check   JWT verification
```

### Controller Pattern
```
Controller receives:
  ├─ req (request with body, params, user)
  └─ res (response methods)

Controller does:
  ├─ Validate input
  ├─ Query database
  ├─ Execute business logic
  ├─ Handle errors
  └─ Send response
```

### Service Integration
```
Service A calls Service B:
  ├─ Uses axios to make HTTP request
  ├─ Passes JWT token in Authorization header
  ├─ Service B validates token
  └─ Service B returns data
```

---

## 🔐 Security Implementation

### JWT Token Flow
```
1. Client logs in
2. Server generates JWT (contains user info, expires in 24h)
3. Client stores token
4. Client sends token with each protected request
5. Server verifies token (via auth middleware)
6. If valid: proceed to controller
7. If invalid: return 401
```

### Authentication Layers
```
Layer 1: Port Firewall
  ├─ Port 8000: Open to internet
  └─ Ports 8001-8005: Internal only

Layer 2: Public vs Protected Routes
  ├─ Public: register, login (no token needed)
  └─ Protected: most endpoints (token required)

Layer 3: JWT Token Verification
  └─ Every protected route verifies token

Layer 4: Role-Based Authorization
  └─ Admin vs User roles
```

---

## 📝 Summary

### API Gateway
- **server.js**: Main app setup
- **swagger.js**: Documentation config
- **proxyRoutes.js**: Route requests to services

### User Service
- **server.js**: App setup
- **swagger.js**: Documentation
- **routes/userRoutes.js**: Define /api/users endpoints
- **controllers/userController.js**: Registration, login, profile management
- **middleware/auth.js**: JWT token verification
- **models/data.js**: In-memory user storage

### Payment Service
- **server.js**: App setup
- **swagger.js**: Documentation
- **routes/paymentRoutes.js**: Define /api/payments endpoints
- **controllers/paymentController.js**: Payment processing, Order Service integration
- **middleware/auth.js**: JWT token verification
- **models/data.js**: In-memory payment storage

All services share common patterns: dependencies, environment configuration, error handling, and Swagger documentation.
