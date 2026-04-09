# Meal Ordering Microservices - Full Documentation

## Overview
This is a microservices-based meal ordering system with the following core services:
- **API Gateway** - Single entry point for all client requests
- **User Service** - Handles user authentication and profile management
- **Payment Service** - Processes payment transactions
- Plus supporting services: Menu Service, Order Service, Restaurant Service

---

## 1. API GATEWAY SERVICE

### Purpose
The API Gateway acts as a central routing hub that directs client requests to appropriate microservices. It provides a unified interface and centralized documentation via Swagger/OpenAPI.

### Architecture
- **Port**: 8000
- **Framework**: Express.js
- **Documentation**: Swagger UI at `/api-docs`

### Key Features
- **Request Routing**: Routes requests to different microservices
- **CORS Support**: Enables cross-origin requests for frontend applications
- **Swagger Documentation**: Interactive API documentation at `/api-docs`
- **Error Handling**: Centralized error handling and 404 responses
- **Health Checks**: Endpoint to verify gateway is running

### Endpoints

#### Root & Health Endpoints
```
GET /
Response: { message: "Meal Ordering API Gateway is running!" }

GET /health
Response: { status: "API Gateway is running" }
```

#### User Service Routes
Proxied through `/api/users/*`:
```
POST /api/users/register          - Register new user
POST /api/users/login             - User login
GET  /api/users                   - Get all users (protected)
GET  /api/users/:id              - Get user by ID (protected)
GET  /api/users/me               - Get current user profile (protected)
PUT  /api/users/:id              - Update user (protected)
DELETE /api/users/:id            - Delete user (protected)
```

#### Menu Service Routes
```
GET  /api/menu                    - Get all menu items
GET  /api/menu/:id               - Get menu item details
POST /api/menu                    - Create menu item (admin only)
PUT  /api/menu/:id               - Update menu item (admin only)
DELETE /api/menu/:id             - Delete menu item (admin only)
```

#### Order Service Routes
```
GET  /api/orders                  - Get all orders (protected)
GET  /api/orders/:id             - Get order details (protected)
POST /api/orders                  - Create new order (protected)
PUT  /api/orders/:id             - Update order (protected)
DELETE /api/orders/:id           - Delete order (protected)
```

#### Payment Service Routes
```
GET  /api/payments                - Get all payments (protected)
GET  /api/payments/:id           - Get payment details (protected)
POST /api/payments                - Process payment (protected)
PUT  /api/payments/:id           - Update payment (protected)
DELETE /api/payments/:id         - Delete payment (protected)
```

#### Restaurant Service Routes
```
GET  /api/restaurants             - Get all restaurants
GET  /api/restaurants/:id        - Get restaurant details
```

### Technical Stack
- **Dependencies**:
  - `express` - Web framework
  - `cors` - Cross-Origin Resource Sharing
  - `axios` - HTTP client for proxying requests
  - `swagger-ui-express` - Swagger documentation UI
  - `swagger-jsdoc` - JSDoc to Swagger converter
  - `dotenv` - Environment variables management

### Configuration Files

**package.json**:
```json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8",
    "dotenv": "^16.3.1"
  }
}
```

**Environment Variables** (.env):
```
PORT=8000
```

### Error Handling
- **404 Not Found**: Returns `{ error: "Endpoint not found" }`
- **500 Internal Server Error**: Returns `{ error: "Internal server error" }`
- Errors are logged to console with full stack trace

### Middleware Stack
1. CORS middleware - Allows requests from different origins
2. JSON body parser - Parses incoming JSON requests
3. Swagger documentation - Service at `/api-docs`
4. Proxy routes - Routes requests to microservices
5. 404 handler - Catches unmatched routes
6. Error handler - Catches and logs errors

### Authentication
- Uses Bearer token (JWT) authentication
- Tokens are passed through Authorization header: `Authorization: Bearer <token>`
- Each microservice validates tokens independently

---

## 2. USER SERVICE

### Purpose
Manages all user-related operations including authentication, registration, profile management, and user data persistence.

### Architecture
- **Port**: 8001
- **Framework**: Express.js
- **Data Storage**: In-memory JSON objects
- **Authentication**: JWT-based tokens

### Key Features
- **User Registration**: Create new user accounts
- **User Login**: Authenticate users and issue JWT tokens
- **Profile Management**: View and update user information
- **User Directory**: Get all users (admin feature)
- **Role-Based Access**: Admin and regular user roles
- **Token Generation**: JWT tokens with 24-hour expiration

### Data Model

#### User Object
```javascript
{
  id: number,                  // Unique identifier
  name: string,               // User's full name
  email: string,              // Email address (unique)
  password: string,           // Password (plain text for MVP)
  phone: string,              // Phone number
  address: string,            // Delivery address
  role: "admin" | "user"      // User role
}
```

#### Default Admin User
```javascript
{
  id: 1,
  name: "Admin User",
  email: "admin@gmail.com",
  password: "admin",
  phone: "1234567890",
  address: "System Admin Address",
  role: "admin"
}
```

### API Endpoints

#### 1. Register User
```
POST /api/users/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",        // Optional
  "address": "123 Main St"       // Optional
}

Success Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "userId": 2,
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "role": "user"
  }
}

Error Responses:
- 400: Missing required fields (name, email, password)
- 409: Email already registered
```

#### 2. User Login
```
POST /api/users/login

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Success Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "role": "user"
  }
}

Error Responses:
- 400: Missing email or password
- 401: Invalid email or password
```

#### 3. Get Current User (Protected)
```
GET /api/users/me
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "role": "user"
  }
}

Error Responses:
- 401: No token provided / Invalid token
- 404: User not found
```

#### 4. Get User by ID (Protected)
```
GET /api/users/:id
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "role": "user"
  }
}

Error Responses:
- 401: No token provided / Invalid token
- 404: User not found
```

#### 5. Update User (Protected)
```
PUT /api/users/:id
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123",
  "phone": "+9876543210",
  "address": "456 Oak Ave"
}

Success Response (200):
{
  "success": true,
  "message": "User updated successfully",
  "user": { ...updated user data... }
}

Error Responses:
- 400: Validation errors
- 403: Forbidden (only owner or admin can update)
- 404: User not found
- 409: Email already in use by another account
```

#### 6. Delete User (Protected)
```
DELETE /api/users/:id
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}

Error Responses:
- 401: No token provided / Invalid token
- 403: Forbidden (only owner or admin can delete)
- 404: User not found
```

#### 7. Get All Users (Protected)
```
GET /api/users
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "count": 2,
  "users": [ {...user1...}, {...user2...} ]
}

Error Responses:
- 401: No token provided / Invalid token
```

### Authentication Flow

#### JWT Token Structure
```javascript
{
  "id": 2,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user"
}
// Signed with JWT_SECRET for 24-hour expiration
```

#### Token Verification Middleware
- Extracts token from `Authorization: Bearer <token>` header
- Verifies token signature using `JWT_SECRET` environment variable
- Attaches user data to `req.user` for route handlers
- Returns 401 if token is missing or invalid

### Authorization Rules
- **Public Endpoints**: Register, Login
- **Protected Endpoints**: All other operations
  - Users can only view/update their own profile (except admin)
  - Admin users can manage all profiles
  - Admin detection: `role === "admin"` or `email === "admin@gmail.com"`

### File Structure
- **server.js**: Express app setup, middleware configuration, port listening
- **routes/userRoutes.js**: Route definitions with Swagger documentation
- **controllers/userController.js**: Business logic for user operations
- **models/data.js**: In-memory data storage and access functions
- **middleware/auth.js**: JWT verification middleware
- **swagger.js**: Swagger/OpenAPI configuration

### Controller Functions
```javascript
register(req, res)          // Create new user
login(req, res)             // Authenticate and return JWT
getMe(req, res)             // Get current user from token
getUserById(req, res)       // Get user by ID
updateUserById(req, res)    // Update user profile
deleteUserById(req, res)    // Delete user
getAllUsersHandler(req, res) // Get all users
```

### Data Storage
- In-memory array: `users[]`
- Counter for auto-incrementing IDs: `userIdCounter`
- Starts with one admin user
- Data persists during server runtime only

### Technical Stack
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Documentation**: Swagger/OpenAPI
- **Port**: 8001

### Environment Variables
```
JWT_SECRET=your_jwt_secret_key
PORT=8001
```

---

## 3. PAYMENT SERVICE

### Purpose
Handles payment processing for orders, integrating with the Order Service to validate orders before processing payments.

### Architecture
- **Port**: 8005
- **Framework**: Express.js
- **Data Storage**: In-memory array
- **Authentication**: JWT-based tokens
- **Integration**: Communicates with Order Service (http://localhost:8004)

### Key Features
- **Process Payments**: Create and process payments for orders
- **Payment Tracking**: Store and retrieve payment records
- **Order Validation**: Verifies orders before accepting payments
- **Payment Methods**: Supports card, cash, and online payments
- **Status Management**: Tracks payment status (pending, completed, failed)
- **Multi-service Communication**: Integrates with Order Service via HTTP

### Data Model

#### Payment Object
```javascript
{
  id: number,                          // Unique identifier
  order_id: number,                    // Associated order ID
  amount: number,                      // Payment amount (from order total_price)
  payment_method: string,              // One of: "card", "cash", "online"
  status: string,                      // One of: "pending", "completed", "failed"
  created_at: string,                  // ISO timestamp
  updated_at: string                   // ISO timestamp (optional)
}
```

#### Example Payment
```javascript
{
  "id": 1,
  "order_id": 5,
  "amount": 49.99,
  "payment_method": "card",
  "status": "completed",
  "created_at": "2026-04-08T10:30:00.000Z"
}
```

### API Endpoints

#### 1. Process Payment
```
POST /api/payments
Headers: Authorization: Bearer <token>

Request Body:
{
  "order_id": 5,
  "payment_method": "card"             // Options: "card", "cash", "online"
}

Success Response (201):
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "id": 1,
    "order_id": 5,
    "amount": 49.99,
    "payment_method": "card",
    "status": "completed",
    "created_at": "2026-04-08T10:30:00.000Z"
  }
}

Error Responses:
- 400: Missing required fields or invalid payment method
- 400: Order status not "pending"
- 401: No token provided / Invalid token
- 404: Order not found
- 500: Error fetching order from Order Service
```

**Processing Logic**:
1. Validates `order_id` and `payment_method` are provided
2. Validates `payment_method` is one of: card, cash, online
3. Fetches order details from Order Service (requires valid JWT)
4. Validates order status is "pending"
5. Extracts amount from order's `total_price`
6. Creates payment with status "completed"
7. Stores payment in memory

#### 2. Get All Payments (Protected)
```
GET /api/payments
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "count": 2,
  "payments": [
    { "id": 1, "order_id": 5, "amount": 49.99, ... },
    { "id": 2, "order_id": 6, "amount": 35.50, ... }
  ]
}

Error Responses:
- 401: No token provided / Invalid token
```

#### 3. Get Payment by ID (Protected)
```
GET /api/payments/:id
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "payment": {
    "id": 1,
    "order_id": 5,
    "amount": 49.99,
    "payment_method": "card",
    "status": "completed",
    "created_at": "2026-04-08T10:30:00.000Z"
  }
}

Error Responses:
- 401: No token provided / Invalid token
- 404: Payment not found
```

#### 4. Update Payment (Protected)
```
PUT /api/payments/:id
Headers: Authorization: Bearer <token>

Request Body:
{
  "status": "failed",                   // Options: "pending", "completed", "failed"
  "payment_method": "online"            // Options: "card", "cash", "online"
}

Success Response (200):
{
  "success": true,
  "message": "Payment updated",
  "payment": {
    "id": 1,
    "order_id": 5,
    "amount": 49.99,
    "payment_method": "online",
    "status": "failed",
    "updated_at": "2026-04-08T10:45:00.000Z"
  }
}

Error Responses:
- 400: Invalid status or payment_method
- 401: No token provided / Invalid token
- 404: Payment not found
```

#### 5. Delete Payment (Protected)
```
DELETE /api/payments/:id
Headers: Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "message": "Payment deleted"
}

Error Responses:
- 401: No token provided / Invalid token
- 404: Payment not found
```

#### 6. Root Endpoint
```
GET /

Response (200):
{
  "message": "Payment Service is up and running"
}
```

#### 7. Health Check
```
GET /health

Response (200):
{
  "status": "Payment Service is running"
}
```

### Service Integration

#### Order Service Communication
The Payment Service communicates with Order Service to:
- Fetch order details before processing payment
- Validate order status before accepting payment
- Get payment amount from order's `total_price`

**Request to Order Service**:
```
GET http://localhost:8004/api/orders/:order_id
Headers: Authorization: Bearer <token>
```

**Expected Order Response**:
```javascript
{
  "id": 5,
  "user_id": 2,
  "total_price": 49.99,
  "status": "pending"              // Must be "pending" for payment processing
  // ...other order fields
}
```

**Error Handling**:
- If order not found (404): Return 404 to client
- If order status not "pending": Return 400 error
- If connection fails: Return 500 error

### Authentication Flow
- All endpoints except `/` and `/health` require JWT authentication
- Token passed via `Authorization: Bearer <token>` header
- Token is forwarded to Order Service for inter-service validation

### Authorization Rules
- **Public Endpoints**: Root `/`, Health check `/health`
- **Protected Endpoints**: All payment operations
  - Requires valid JWT token
  - No role-based restrictions (any authenticated user can process payment for any order)

### File Structure
- **server.js**: Express app setup, middleware, Swagger definitions, port listening
- **routes/paymentRoutes.js**: Route definitions
- **controllers/paymentController.js**: Payment processing logic
- **models/data.js**: In-memory payment storage
- **middleware/auth.js**: JWT verification middleware
- **swagger.js**: OpenAPI/Swagger configuration

### Controller Functions
```javascript
processPayment(req, res)    // Create and process payment
getAllPayments(req, res)    // Retrieve all payments
getPaymentById(req, res)    // Retrieve specific payment
updatePayment(req, res)     // Update payment details
deletePayment(req, res)     // Remove payment record
```

### Data Storage
- In-memory array: `payments[]`
- Auto-incrementing IDs based on array length
- Timestamps in ISO 8601 format
- Data persists during server runtime only

### Technical Stack
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **HTTP Client**: Axios (for Order Service communication)
- **Documentation**: Swagger/OpenAPI
- **Port**: 8005

### Environment Variables
```
JWT_SECRET=your_jwt_secret_key
PORT=8005
```

### Valid Values
```javascript
// Payment Methods
["card", "cash", "online"]

// Payment Statuses
["pending", "completed", "failed"]

// Order Status (must be "pending" to process payment)
"pending"
```

### Example Workflow

1. **User Places Order** → Order Service (status: "pending")
2. **User Initiates Payment** → Payment Service
3. **Payment Service Validates**:
   - Checks order exists
   - Confirms status is "pending"
   - Gets payment amount from order
4. **Payment Service Processes** → Creates payment record (status: "completed")
5. **Order Service Updates** → Changes order status to "confirmed" (future integration)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATION                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   API GATEWAY        │
          │   (Port 8000)        │
          │                      │
          │ Routes Requests To:  │
          └──────────────────────┘
           │    │    │    │    │
      ┌────┘    │    │    │    └─────────┐
      ▼         ▼    ▼    ▼              ▼
   ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐
   │User  │ │Menu  │ │Order     │ │Restaurant│
   │Svc   │ │Svc   │ │Service   │ │Service   │
   │(8001)│ │(8003)│ │(8004)    │ │(8002)    │
   └──────┘ └──────┘ └──────────┘ └──────────┘
      │
      │ JWT Tokens
      │
      ▼
   ┌──────────────────┐
   │ Payment Service  │
   │ (Port 8005)      │
   │                  │
   │ Validates Users  │
   │ Fetches Orders   │
   └──────────────────┘
```

### Service Communication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /api/users/register
       ▼
   ┌─────────────────┐
   │  API Gateway    │────routes───► User Service
   │  (Port 8000)    │               (Port 8001)
   └────────┬────────┘
            │ 2. POST /api/payments
            ▼
        ┌──────────────────┐
        │ Payment Service  │
        │  (Port 8005)     │
        └────────┬─────────┘
                 │ 3. GET /api/orders/:id (with JWT)
                 ▼
            ┌──────────────┐
            │ Order Service│
            │ (Port 8004)  │
            └──────────────┘
```

---

## JWT Token Workflow

### Token Generation (User Service - Login)
```
1. User provides email & password
2. User Service verifies credentials
3. Generates JWT with payload:
   {
     "id": user_id,
     "email": user_email,
     "name": user_name,
     "role": user_role
   }
4. Signs with JWT_SECRET
5. Returns token to client
```

### Token Usage (Protected Endpoints)
```
1. Client sends request with:
   Authorization: Bearer <jwt_token>

2. Service extracts token from header
3. Calls JWT verification middleware
4. Verifies signature using JWT_SECRET
5. Decodes payload into req.user
6. Proceeds with request handler
```

### Token Validation Failure
```
Scenarios:
- Missing token → 401 "No token provided"
- Invalid signature → 401 "Invalid token"
- Expired token → 401 "Invalid or expired token"
- Malformed header → 401 "Authentication required"
```

---

## Database/Data Storage Strategy

### Current Implementation
All three services use **in-memory data storage**:
- User Service: Array of user objects in `models/data.js`
- Payment Service: Array of payment objects in `models/data.js`
- Data persists only during server runtime
- **Data is lost when server restarts**

### Data Persistence in Production
For production deployment, implement:

1. **Relational Database** (Recommended):
   - PostgreSQL or MySQL
   - Tables: users, payments, orders, etc.
   - ACID compliance for payment transactions

2. **NoSQL Database** (Alternative):
   - MongoDB for flexible schema
   - Collections: users, payments, orders

3. **Implementation Steps**:
   - Replace in-memory arrays with database queries
   - Use ORM (Sequelize, TypeORM) or query builders (Knex)
   - Implement connection pooling
   - Add transaction support for payment operations

---

## Security Considerations

### Current Implementation (MVP)
⚠️ **NOT suitable for production**

1. **Passwords**: Stored in plain text
2. **CORS**: Allowed from all origins
3. **JWT Secret**: Should be environment variable
4. **No HTTPS**: All communication in plain HTTP
5. **No rate limiting**: Vulnerable to brute force

### Production Recommendations

1. **Password Security**:
   ```javascript
   // Use bcrypt for hashing
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **CORS Configuration**:
   ```javascript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(','),
     credentials: true
   }));
   ```

3. **HTTPS/TLS**: Use SSL certificates

4. **Rate Limiting**:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use(limiter);
   ```

5. **Input Validation**: Use joi or express-validator

6. **Logging**: Implement proper logging (Winston, Morgan)

7. **Environment Variables**: Never hardcode secrets

---

## Environment Setup

### .env File Template
```
# API Gateway
GATEWAY_PORT=8000

# User Service
USER_SERVICE_PORT=8001
USER_SERVICE_URL=http://localhost:8001

# Menu Service
MENU_SERVICE_PORT=8003
MENU_SERVICE_URL=http://localhost:8003

# Order Service
ORDER_SERVICE_PORT=8004
ORDER_SERVICE_URL=http://localhost:8004

# Payment Service
PAYMENT_SERVICE_PORT=8005
PAYMENT_SERVICE_URL=http://localhost:8005

# Restaurant Service
RESTAURANT_SERVICE_PORT=8002
RESTAURANT_SERVICE_URL=http://localhost:8002

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h

# Database (future)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=user
# DB_PASSWORD=password
# DB_NAME=meal_ordering_db
```

---

## Running the Services

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- All environment variables configured

### Startup Process

**Terminal 1: API Gateway**
```bash
cd meal-ordering-microservices/api-gateway
npm install
npm start
# Runs on http://localhost:8000
```

**Terminal 2: User Service**
```bash
cd meal-ordering-microservices/user-service
npm install
npm start
# Runs on http://localhost:8001
```

**Terminal 3: Payment Service**
```bash
cd meal-ordering-microservices/payment-service
npm install
npm start
# Runs on http://localhost:8005
```

**Terminal 4+: Other Services** (Menu, Order, Restaurant)
```bash
cd meal-ordering-microservices/<service-name>
npm install
npm start
```

### Verify Services
```bash
# Check all services are running
curl http://localhost:8000/health      # API Gateway
curl http://localhost:8001/health      # User Service
curl http://localhost:8005/health      # Payment Service
```

### Access API Documentation
- **API Gateway Swagger**: http://localhost:8000/api-docs
- **User Service Swagger**: http://localhost:8001/api-docs
- **Payment Service Swagger**: http://localhost:8005/api-docs

---

## Testing the Services

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "123 Main St"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
# Returns: { success: true, token: "...", user: {...} }
```

### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:8000/api/users/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### 4. Process Payment
```bash
curl -X POST http://localhost:8000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "order_id": 5,
    "payment_method": "card"
  }'
```

### 5. Get All Payments
```bash
curl -X GET http://localhost:8000/api/payments \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find and kill process on port
lsof -i :8000
kill -9 <PID>

# Or change PORT in .env
```

#### JWT_SECRET Not Found
```
Error: Cannot read properties of undefined
```
**Solution**: Set JWT_SECRET in .env file

#### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Verify CORS is enabled in API Gateway

#### Order Not Found When Processing Payment
```
Error: Order not found
```
**Solution**: 
- Verify Order Service is running (http://localhost:8004/health)
- Verify order_id exists
- Check order status is "pending"

#### Token Expired
```
Invalid or expired token
```
**Solution**: Login again to get a new token

---

## Summary Table

| Service | Port | Purpose | Auth | Storage |
|---------|------|---------|------|---------|
| API Gateway | 8000 | Routes requests to services | - | - |
| User Service | 8001 | Authentication & profiles | JWT | In-memory |
| Menu Service | 8003 | Menu management | JWT | In-memory |
| Order Service | 8004 | Order processing | JWT | In-memory |
| Payment Service | 8005 | Payment processing | JWT | In-memory |
| Restaurant Service | 8002 | Restaurant info | - | In-memory |

---

## Next Steps for Enhancement

1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **Password Hashing**: Implement bcrypt for secure password storage
3. **Payment Gateway**: Integrate with Stripe/PayPal
4. **Message Queue**: Add RabbitMQ for async operations
5. **Logging**: Implement Winston/Morgan for logging
6. **Testing**: Add Jest unit and integration tests
7. **Docker**: Containerize services with Docker
8. **Kubernetes**: Deploy with K8s for production
9. **API Versioning**: Implement API versioning (v1, v2)
10. **WebSockets**: Real-time order/payment notifications
