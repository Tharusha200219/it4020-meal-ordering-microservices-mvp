# Meal Ordering Microservices - FAQ & Architecture Deep Dive

## 1. WHY API GATEWAY & WHAT IS IT?

### What is an API Gateway?

An API Gateway is a **server that acts as an intermediary between clients and backend services**. Think of it as a **front desk receptionist** who receives all incoming requests and directs them to the appropriate department.

```
WITHOUT API Gateway:
┌─────────────────────────────────────────┐
│           CLIENT APP                    │
└──────┬──────────┬──────────┬────────────┘
       │          │          │
       ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │User    │ │Order   │ │Payment │
   │Service │ │Service │ │Service │
   └────────┘ └────────┘ └────────┘

Problems:
- Client must know all service URLs
- All services exposed to internet
- Difficult to scale/modify services
- No centralized security/logging
```

```
WITH API Gateway:
┌─────────────────────────────────────────┐
│           CLIENT APP                    │
└──────────────────────┬────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   API GATEWAY        │
            │   (Single Entry)     │
            │   Port 8000          │
            └───┬────────┬────────┬┘
                │         │        │
                ▼         ▼        ▼
            ┌────────┐ ┌────────┐ ┌────────┐
            │User    │ │Order   │ │Payment │
            │Service │ │Service │ │Service │
            └────────┘ └────────┘ └────────┘

Benefits:
- Single URL for clients (localhost:8000)
- Services hidden from internet
- Easy security & logging at one place
- Can scale services independently
- Can modify backends without breaking clients
```

### In Your Project: API Gateway at Port 8000

```
CLIENT makes request:
    POST http://localhost:8000/api/users/login

API Gateway receives and:
    1. Check if endpoint exists
    2. Log the request
    3. Route to correct service

API Gateway forwards to User Service:
    POST http://localhost:8001/api/users/login
    (User Service runs on port 8001 internally)

User Service responds back to API Gateway
API Gateway forwards to CLIENT
```

### Why Use API Gateway in Your Project?

**✅ Reasons your project uses it:**

1. **Single Entry Point**: Client only knows `localhost:8000`, not individual service ports
2. **Security**: Clients don't have direct access to individual services
3. **Routing Logic**: Routes `/api/users/*` → User Service, `/api/payments/*` → Payment Service
4. **Documentation**: One Swagger UI at `localhost:8000/api-docs` for all services
5. **Future Security**: Can add authentication/rate-limiting at gateway level
6. **Service Independence**: Can move User Service to different port without breaking clients

---

## 2. ENDPOINTS, LOCATIONS & WHAT IS HAPPENING

### Endpoint Structure

```
Full URL: http://localhost:8000/api/users/login
          └─────┬─────┘└┬─┘└─────┬─────┘
          Domain  Port   Base    Endpoint
          
          localhost = Your computer
          8000 = API Gateway port
          /api = Base path
          /users/login = Specific endpoint
```

### How Requests Flow Through Endpoints

#### Example: User Registration

**Step 1: Request Enters API Gateway**
```
POST http://localhost:8000/api/users/register
Headers:
  Content-Type: application/json
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Step 2: API Gateway Routes Request** (In file: `api-gateway/routes/proxyRoutes.js`)
```javascript
// API Gateway sees /api/users/register
// It says: "This is a USER endpoint, forward to User Service"
// API Gateway forwards to: http://localhost:8001/api/users/register
```

**Step 3: User Service Receives** (In file: `user-service/routes/userRoutes.js`)
```javascript
// User Service receives on its port 8001
// Routes to controller: controllers/userController.js
// Calls: register(req, res) function
```

**Step 4: Business Logic** (In file: `user-service/controllers/userController.js`)
```javascript
const register = (req, res) => {
  // 1. Extract data from request
  const { name, email, password, phone, address } = req.body;
  
  // 2. Validation (checks below)
  if (!name || !email || !password) {
    return res.status(400).json({ error: "required fields missing" });
  }
  
  // 3. Save to database
  const user = createUser(name, email, password, phone, address);
  
  // 4. Send response
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user.id
  });
};
```

**Step 5: Response Returns** (Reversed path)
```
User Service → API Gateway → Client
```

### All Endpoint Locations

| Endpoint | Location | Port | What Happens |
|----------|----------|------|--------------|
| `POST /api/users/register` | user-service/routes/userRoutes.js | 8001 | Creates new user in database |
| `POST /api/users/login` | user-service/routes/userRoutes.js | 8001 | Validates password, generates JWT token |
| `GET /api/users/me` | user-service/routes/userRoutes.js | 8001 | Returns current logged-in user |
| `GET /api/payments` | payment-service/routes/paymentRoutes.js | 8005 | Lists all payments |
| `POST /api/payments` | payment-service/routes/paymentRoutes.js | 8005 | Creates new payment, calls Order Service |
| `GET /api/orders` | order-service/routes/orderRoutes.js | 8004 | Lists all orders |
| `GET /api/menu` | menu-service/routes/menuRoutes.js | 8003 | Lists all menu items |
| `GET /` | All services | 8000-8005 | Root endpoint, says service is running |
| `GET /health` | All services | 8000-8005 | Health check endpoint |
| `GET /api-docs` | All services | 8000-8005 | Swagger documentation UI |

### File Locations

**API Gateway Routing** → `meal-ordering-microservices/api-gateway/routes/proxyRoutes.js`
- Handles: `/api/users/*`, `/api/payments/*`, `/api/orders/*`, etc.
- Forwards each request to correct service

**User Service Endpoints** → `meal-ordering-microservices/user-service/routes/userRoutes.js`
- Receives requests from API Gateway on port 8001
- Definition of all `/api/users/*` endpoints

**User Service Business Logic** → `meal-ordering-microservices/user-service/controllers/userController.js`
- `register()` - Creates user
- `login()` - Authenticates user, generates JWT
- `getMe()` - Returns current user
- `updateUserById()` - Updates user profile
- `deleteUserById()` - Deletes user

**Payment Service Endpoints** → `meal-ordering-microservices/payment-service/routes/paymentRoutes.js`
- Receives requests from API Gateway on port 8005
- Definition of all `/api/payments/*` endpoints

**Payment Service Business Logic** → `meal-ordering-microservices/payment-service/controllers/paymentController.js`
- `processPayment()` - Creates payment, calls Order Service
- `getAllPayments()` - Returns all payments
- `getPaymentById()` - Returns specific payment
- `updatePayment()` - Updates payment status

---

## 3. WHERE ARE VALIDATIONS & WHAT IS BEING VALIDATED?

### Types of Validation in Your Project

#### A. Route-Level Validation (Middleware)

**File**: `user-service/middleware/auth.js`
```javascript
// Checks if JWT token is valid
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Continue to endpoint
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

**Usage**: Routes that need authentication
```javascript
// In user-service/routes/userRoutes.js
router.get("/me", verifyToken, getMe);  // Token verified before getMe is called
```

#### B. Controller-Level Validation

**File**: `user-service/controllers/userController.js` - `register()` function

```javascript
const register = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // ✓ Validation 1: Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: "name, email, and password are required" 
    });
  }

  // ✓ Validation 2: Check if email already exists
  if (findUserByEmail(email)) {
    return res.status(409).json({ 
      error: "Email already registered" 
    });
  }

  // ✓ If all valid, create user
  const user = createUser(name, email, password, phone || "", address || "");
  
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user.id
  });
};
```

**Validation in this function:**
1. Name, email, password are provided
2. Email is not already in database
3. Phone and address are optional (default to empty string)

#### C. Login Validation

**File**: `user-service/controllers/userController.js` - `login()` function

```javascript
const login = (req, res) => {
  const { email, password } = req.body;

  // ✓ Validation 1: Check both fields provided
  if (!email || !password) {
    return res.status(400).json({ 
      error: "email and password are required" 
    });
  }

  // ✓ Validation 2: Check user exists
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ 
      error: "Invalid email or password" 
    });
  }

  // ✓ Validation 3: Check password matches
  if (user.password !== password) {
    return res.status(401).json({ 
      error: "Invalid email or password" 
    });
  }

  // ✓ If all valid, generate token and return
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: getUserForResponse(user)
  });
};
```

#### D. Payment Validation

**File**: `payment-service/controllers/paymentController.js` - `processPayment()` function

```javascript
const processPayment = async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;

    // ✓ Validation 1: Required fields present
    if (!order_id || !payment_method) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id and payment_method are required' 
      });
    }

    // ✓ Validation 2: Payment method is valid
    const validMethods = ['card', 'cash', 'online'];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment_method. Allowed: card, cash, online' 
      });
    }

    // ✓ Validation 3: Order exists (calls Order Service)
    let orderResponse;
    try {
      orderResponse = await axios.get(
        `http://localhost:8004/api/orders/${order_id}`, 
        { headers: { Authorization: req.headers.authorization } }
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }
    }

    // ✓ Validation 4: Order status is "pending"
    const orderData = orderResponse.data.order ? orderResponse.data.order : orderResponse.data;
    if (orderData.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot process payment for order with status '${orderData.status}'. Must be 'pending'.` 
      });
    }

    // ✓ All validations passed - create payment
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

### Validation Summary Table

| What is Validated | Where | How | Response if Invalid |
|------------------|-------|-----|-------------------|
| JWT Token | middleware/auth.js | `jwt.verify()` | 401 Unauthorized |
| Required Fields (Register) | controller/register | `if (!field)` | 400 Bad Request |
| Email Uniqueness | controller/register | `findUserByEmail()` | 409 Conflict |
| Email/Password Match | controller/login | Direct comparison | 401 Unauthorized |
| Payment Method | controller/processPayment | In array check | 400 Bad Request |
| Order Exists | controller/processPayment | HTTP call to Order Service | 404 Not Found |
| Order Status | controller/processPayment | `if (status !== 'pending')` | 400 Bad Request |

---

## 4. IN-MEMORY DATABASE - WHAT, WHERE, HOW?

### What is In-Memory Database?

```
Regular Database (e.g., PostgreSQL):
┌─────────────────────────────────┐
│   DISK (Hard Drive/SSD)         │
│  (Permanent Storage)            │
├─────────────────────────────────┤
│  File: users.db                 │
│  ├─ User 1: John Doe            │
│  ├─ User 2: Jane Smith          │
│  └─ User 3: Bob Johnson         │
└─────────────────────────────────┘
Data survives even if server restarts


In-Memory Database (In Your Project):
┌─────────────────────────────────┐
│   RAM (Computer Memory)         │
│  (Temporary Storage)            │
├─────────────────────────────────┤
│  JavaScript Array:              │
│  let users = [                  │
│    { id: 1, name: "John" },     │
│    { id: 2, name: "Jane" },     │
│    { id: 3, name: "Bob" }       │
│  ]                              │
└─────────────────────────────────┘
Data is LOST when server restarts
```

### Where In-Memory Database is Used in Your Project

#### 1. User Service Database

**File**: `meal-ordering-microservices/user-service/models/data.js`

```javascript
// In-memory users storage
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

// ✓ Function to find user by email
const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

// ✓ Function to create new user
const createUser = (name, email, password, phone, address) => {
  const user = {
    id: userIdCounter++,     // Auto-increment ID
    name,
    email,
    password,
    phone,
    address,
    role: "user"
  };
  users.push(user);           // Add to array
  return user;
};
```

#### 2. Payment Service Database

**File**: `meal-ordering-microservices/payment-service/models/data.js`

```javascript
// In-memory payments storage
let payments = [];  // Empty array, payments added when created

// When Payment Service starts:
// payments = []

// When payment is created:
// payments.push({
//   id: 1,
//   order_id: 5,
//   amount: 49.99,
//   payment_method: "card",
//   status: "completed",
//   created_at: "2026-04-08T10:30:00.000Z"
// })

// When server restarts:
// payments = [] (goes back to empty!)
```

### How In-Memory Database is Used

#### Scenario: Creating a User

**Step 1: Request arrives**
```javascript
POST /api/users/register
Body: { name: "John", email: "john@example.com", password: "pass123" }
```

**Step 2: Controller calls data functions**
```javascript
// In userController.js
const user = createUser(name, email, password, phone, address);
```

**Step 3: Data function updates in-memory array**
```javascript
// In models/data.js
const createUser = (name, email, password, phone, address) => {
  const user = {
    id: userIdCounter++,      // userIdCounter becomes 2, 3, 4...
    name,
    email,
    password,
    phone,
    address,
    role: "user"
  };
  users.push(user);            // ← ADDS TO ARRAY IN RAM
  return user;
};

// After call, users array looks like:
// [
//   { id: 1, email: "admin@gmail.com", ... },
//   { id: 2, email: "john@example.com", ... }  ← NEW
// ]
```

**Step 4: Response sent back**
```javascript
res.status(201).json({
  success: true,
  message: "User registered successfully",
  userId: 2
});
```

#### Scenario: Getting All Users

```javascript
// Client requests:
GET /api/users
Headers: Authorization: Bearer <token>

// Controller calls:
const getAllUsers = () => {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  }));
};

// Returns current users array (whatever is in RAM)
// Response:
[
  { id: 1, name: "Admin User", ... },
  { id: 2, name: "John Doe", ... }
]
```

### Problem with In-Memory Database

```
Scenario Timeline:

Time 1: User Service starts
  users = [{ id: 1, name: "Admin" }]

Time 2: Create user "John"
  users = [{ id: 1, name: "Admin" }, { id: 2, name: "John" }]

Time 3: Server crashes or restarts
  users = [] ← DATA IS LOST!

Time 4: User Service starts again
  users = [{ id: 1, name: "Admin" }] ← ONLY ADMIN, JOHN IS GONE

User John's account is lost forever!
```

### Why Use In-Memory for MVP?

```
✓ ADVANTAGES (Why your project uses it):
  - Simple to implement (just arrays and objects)
  - No database setup required
  - Fast (no disk I/O)
  - Good for testing/development

✗ DISADVANTAGES:
  - Data lost on restart
  - Cannot scale (data only on one server)
  - No persistence
  - No backups
```

### Real-World: Database vs In-Memory

```
DEVELOPMENT (Current - Your Project)
├─ User Service (port 8001)
│  └─ In-memory: users = []
├─ Payment Service (port 8005)
│  └─ In-memory: payments = []
└─ Order Service (port 8004)
   └─ In-memory: orders = []

PRODUCTION (What would be recommended)
├─ User Service (port 8001)
│  └─ connects to PostgreSQL
│     ├─ TABLE: users (with 1000s of rows)
│     └─ TABLE: sessions
├─ Payment Service (port 8005)
│  └─ connects to PostgreSQL
│     ├─ TABLE: payments (with 1000s of rows)
│     └─ TABLE: transactions
└─ Order Service (port 8004)
   └─ connects to PostgreSQL
      ├─ TABLE: orders (with 1000s of rows)
      └─ TABLE: order_items
```

---

## 5. DIFFERENT PORTS (8000, 8001, 8005, etc.) - WHAT'S THE DIFFERENCE?

### Port Numbers Explained

A **port** is like an apartment number in a building. Multiple services can run on same computer but different ports.

```
Your Computer = Building
Localhost (127.0.0.1) = Building Address

Services = Apartments with Different Ports:
┌────────────────────────────────┐
│ Building: localhost (Computer) │
├────────────────────────────────┤
│ Apartment 8000: API Gateway    │
│ Apartment 8001: User Service   │
│ Apartment 8002: Restaurant Svc │
│ Apartment 8003: Menu Service   │
│ Apartment 8004: Order Service  │
│ Apartment 8005: Payment Service│
└────────────────────────────────┘

To reach User Service:
http://localhost:8001/api/users

To reach Payment Service:
http://localhost:8005/api/payments
```

### What Happens When You Go Through Different Ports

#### Scenario: Register User

**Option 1: Direct to User Service (Port 8001)**
```
Client Request:
POST http://localhost:8001/api/users/register
Body: { name: "John", email: "john@example.com", password: "pass" }

Response: 
201 Created
{ "success": true, "userId": 2 }

Pros:
- Direct connection
- One hop

Cons:
- Client must know User Service port
- IF port changes, client breaks
- Not recommended in production
- Security risk (service exposed)
```

**Option 2: Through API Gateway (Port 8000)** ✓ RECOMMENDED

```
Client Request:
POST http://localhost:8000/api/users/register
Body: { name: "John", email: "john@example.com", password: "pass" }

What Happens Inside:

1. API Gateway (8000) receives request
2. Recognizes "/api/users" pattern
3. Forwards to User Service (8001):
   POST http://localhost:8001/api/users/register
4. User Service processes and returns response
5. API Gateway forwards back to Client

Response to Client:
201 Created
{ "success": true, "userId": 2 }

Pros:
- Client only knows port 8000
- Services hidden
- Can change service port without client knowing
- Centralized security/logging
```

### Port Differences Breakdown

| Port | Service | Endpoints | Internal? | Should Clients Access? |
|------|---------|-----------|-----------|----------------------|
| 8000 | API Gateway | `/api/*`, `/api-docs`, `/health` | No | ✓ YES |
| 8001 | User Service | `/api/users/*`, `/health` | Yes | ✗ No (use gateway) |
| 8002 | Restaurant Service | `/api/restaurants/*`, `/health` | Yes | ✗ No (use gateway) |
| 8003 | Menu Service | `/api/menu/*`, `/health` | Yes | ✗ No (use gateway) |
| 8004 | Order Service | `/api/orders/*`, `/health` | Yes | ✗ No (use gateway) |
| 8005 | Payment Service | `/api/payments/*`, `/health` | Yes | ✗ No (use gateway) |

### Service-to-Service Communication

Services communicate with EACH OTHER on internal ports:

```
Payment Service needs to verify order exists:
Payment Service (8005) → Order Service (8004)

Code in paymentController.js:
await axios.get(
  `http://localhost:8004/api/orders/${order_id}`,
  { headers: { Authorization: req.headers.authorization } }
);

"Call Order Service on port 8004 and get order details"
```

---

## 6. EXTERNAL PARTIES vs INTERNAL PARTIES - COMMUNICATION

### What are External and Internal Parties?

```
EXTERNAL PARTIES (Outside your system):
├─ Users (on their computers/phones)
├─ Client Applications (web/mobile apps)
├─ Payment Processors (Stripe, PayPal)
└─ Third-party APIs

INTERNAL PARTIES (Inside your system):
├─ API Gateway
├─ User Service
├─ Order Service
├─ Payment Service
├─ Menu Service
└─ Restaurant Service
```

### How They Communicate - Architecture

```
                    ┌─────────────────┐
                    │  EXTERNAL PARTY │
                    │  (User/Client)  │
                    └────────┬────────┘
                             │
                  Makes request via HTTPS/HTTP
                             │
                             ▼
                 ┌─────────────────────────┐
                 │  API GATEWAY            │
                 │  (Port 8000)            │
                 │  Entry Point            │
                 └─────────────────────────┘
                    │         │         │
         ┌──────────┘         │         └──────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌──────────┐         ┌──────────┐        ┌──────────┐
   │ User     │         │ Payment  │        │ Order    │
   │ Service  │         │ Service  │        │ Service  │
   │ (8001)   │         │ (8005)   │        │ (8004)   │
   └──────────┘         └──────────┘        └──────────┘

INTERNAL COMMUNICATION (between services):
Payment Service (8005) ←HTTP→ Order Service (8004)
"Payment Service needs to check if order exists"
```

### Communication Example 1: User Registration

**External Party (Client) → System**

```
STEP 1: External Party (User on browser)
┌─────────────────────────────────────┐
│ Browser Request                      │
├─────────────────────────────────────┤
│ POST http://localhost:8000/          │
│           api/users/register         │
│                                      │
│ Body:                                │
│ {                                    │
│   "name": "John",                    │
│   "email": "john@example.com",       │
│   "password": "pass123"              │
│ }                                    │
└────────────────────┬────────────────┘
                     │
         External Communication
         (HTTP Request from Browser)
                     │
                     ▼
STEP 2: Enters System (API Gateway)
┌─────────────────────────────────────┐
│ API Gateway (Port 8000)              │
└────────────────────┬────────────────┘
         "I see /api/users/ pattern
          This goes to User Service"
                     │
         Internal Communication
         (HTTP Request on localhost)
                     │
                     ▼
STEP 3: User Service Processes
┌─────────────────────────────────────┐
│ User Service (Port 8001)             │
│ 1. Extract: name, email, password    │
│ 2. Validate inputs                   │
│ 3. Check email not duplicate         │
│ 4. Create user in in-memory database │
│ 5. Send 201 response                 │
└────────────────────┬────────────────┘
                     │
         Response sent back
                     │
                     ▼
STEP 4: Gateway Forwards Response
┌─────────────────────────────────────┐
│ API Gateway returns to Client        │
└────────────────────┬────────────────┘
                     │
        External Communication
        (HTTP Response to Browser)
                     │
                     ▼
STEP 5: External Party (Browser) receives
┌─────────────────────────────────────┐
│ Browser receives:                    │
│ 201 Created                          │
│                                      │
│ {                                    │
│   "success": true,                   │
│   "userId": 2,                       │
│   "user": { ... }                    │
│ }                                    │
│                                      │
│ Shows: "Account created successfully"│
└─────────────────────────────────────┘
```

### Communication Example 2: Process Payment (Service-to-Service)

**External Party → System → Internal Service → Internal Service**

```
STEP 1: External Party (User in browser)
┌─────────────────────────────────────┐
│ Click "Pay Now" button               │
│ POST http://localhost:8000/          │
│          api/payments                │
│                                      │
│ Headers: Authorization: Bearer TOKEN │
│ Body: { order_id: 5,                 │
│         payment_method: "card" }     │
└────────────────────┬────────────────┘
                     │
         External → API Gateway
                     │
                     ▼
STEP 2: API Gateway Routes
┌─────────────────────────────────────┐
│ API Gateway (Port 8000)              │
│ "This is /api/payments"              │
│ "Send to Payment Service"            │
└────────────────────┬────────────────┘
                     │
         Forward to Payment Service
                     │
                     ▼
STEP 3: Payment Service Receives
┌─────────────────────────────────────┐
│ Payment Service (Port 8005)          │
│ 1. Check order_id and payment_method │
│ 2. Validate inputs...                │
│ 3. NEEDS TO VERIFY ORDER EXISTS     │
│    ↓ (Calls Order Service)           │
└────────────────────┬────────────────┘
                     │
    INTERNAL SERVICE-TO-SERVICE CALL
    (Payment Service talking to Order Service)
                     │
                     ▼
STEP 4: Contact Order Service
┌─────────────────────────────────────┐
│ Payment Service calls:               │
│ GET http://localhost:8004/           │
│        api/orders/5                  │
│                                      │
│ (Sending the JWT token along)        │
│ Headers: Authorization: Bearer TOKEN │
└────────────────────┬────────────────┘
                     │
         Internal HTTP Request
         (Service to Service)
                     │
                     ▼
STEP 5: Order Service Responds
┌─────────────────────────────────────┐
│ Order Service Checks:                │
│ 1. Find order ID 5                   │
│ 2. Return order details              │
│                                      │
│ Response:                            │
│ {                                    │
│   "id": 5,                           │
│   "total_price": 49.99,              │
│   "status": "pending"                │
│ }                                    │
└────────────────────┬────────────────┘
                     │
         Response back to Payment Service
                     │
                     ▼
STEP 6: Payment Service Processes
┌─────────────────────────────────────┐
│ Payment Service:                     │
│ 1. Received order data               │
│ 2. Check status is "pending" ✓       │
│ 3. Amount = order.total_price        │
│ 4. Create payment in database        │
│ 5. Return 201 response               │
└────────────────────┬────────────────┘
                     │
         Back to API Gateway
                     │
                     ▼
STEP 7: API Gateway → Client
┌─────────────────────────────────────┐
│ 201 Created                          │
│                                      │
│ {                                    │
│   "success": true,                   │
│   "message": "Payment processed",    │
│   "payment": { id: 1, ... }          │
│ }                                    │
└────────────────────┬────────────────┘
                     │
         External Response
                     │
                     ▼
STEP 8: User's Browser
┌─────────────────────────────────────┐
│ Shows: "Payment successful!"         │
│ Order is now confirmed               │
└─────────────────────────────────────┘
```

### Communication Methods

| Direction | Method | How | Example |
|-----------|--------|-----|---------|
| External → Internal | HTTP Request | User opens browser and requests | POST http://localhost:8000/api/users/login |
| Internal → Internal | HTTP/Axios | Service calls another service | await axios.get('http://localhost:8004/api/orders/:id') |
| Internal → External | HTTP Response | Service returns to user | 200 OK with JSON data |

---

## 7. WHO CAN DIRECTLY ACCESS? SECURITY

### Can Everyone Access Everything?

```
SHORT ANSWER: NO ❌

The Architecture Prevents It

DENIED: Direct access to services
❌ http://localhost:8001/api/users/login    (blocked by architecture)
❌ http://localhost:8005/api/payments       (blocked by architecture)

ALLOWED: Only through gateway
✓ http://localhost:8000/api/users/login     (allowed)
✓ http://localhost:8000/api/payments        (allowed)
```

### Access Control Layers

#### Layer 1: Port-Based Access Control

```
Network Architecture:
┌─────────────────────────────────────┐
│     INTERNET / EXTERNAL USERS       │
└────────────────────┬────────────────┘
                     │
          Can reach port 8000 only
                     │
                     ▼
        ┌────────────────────────┐
        │  API Gateway (8000)    │
        │  ✓ Exposed to Internet │
        └────────────────────────┘
                     │
          Internal network only
                     │
    ┌────┬────┬────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼    ▼
 (8001)(8002)(8003)(8004)(8005)
 User  Rest  Menu  Order Payment
 Svc   Svc   Svc   Svc   Svc
  ✗    ✗     ✗     ✗     ✗
 NOT ACCESSIBLE FROM INTERNET
```

**In Real Deployment:**
```
Using Firewall Rules:
- Port 8000: OPEN to internet
- Ports 8001-8005: CLOSED to internet (only internal)

So:
✓ External user CAN access: localhost:8000
✗ External user CANNOT access: localhost:8001, 8005
  (firewall blocks it)
```

#### Layer 2: Authentication (JWT Tokens)

**For Protected Endpoints:**

```
Non-Protected: Register & Login
GET  / 
GET  /health
POST /api/users/register
POST /api/users/login

These anyone can access (no token needed)


Protected Endpoints: Most operations
GET  /api/users/me
GET  /api/users/:id
PUT  /api/users/:id
POST /api/payments
GET  /api/payments

These REQUIRE JWT token

Example:
Request WITHOUT token:
GET /api/users/me
RESPONSE: 401 Unauthorized
{ "error": "No token provided" }

Request WITH token:
GET /api/users/me
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
RESPONSE: 200 OK
{ "success": true, "user": {...} }
```

**How JWT Token is Generated:**

```
Step 1: User Logs In
POST http://localhost:8000/api/users/login
Body: { email: "john@example.com", password: "pass123" }

Step 2: Server Validates
- Check email exists
- Check password matches

Step 3: Server Creates JWT Token
const token = jwt.sign(
  { 
    id: 2,
    email: "john@example.com",
    name: "John Doe",
    role: "user"
  },
  process.env.JWT_SECRET,     // Secret key
  { expiresIn: "24h" }         // Valid for 24 hours
);

Step 4: Token Returned to User
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Step 5: Client Stores Token
- In browser localStorage
- In mobile app secure storage

Step 6: Client Uses Token for Protected Requests
GET /api/users/me
Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Token Verification:**

```
Server receives request with token:

1. Extract token from header
   Authorization: "Bearer <token>"
   Extract: <token>

2. Verify token signature
   jwt.verify(token, JWT_SECRET)
   
3. If valid:
   - Extract user data from token
   - Attach to request: req.user
   - Continue to endpoint handler
   
4. If invalid:
   - Return: 401 Unauthorized
   - Stop processing

Code in middleware/auth.js:
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Now endpoint can access user info
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

#### Layer 3: Role-Based Authorization

```
Different users have different access levels:

Admin User:
- email: admin@gmail.com
- role: "admin"
- Can: Create, Read, Update, Delete any user

Regular User:
- email: user@example.com
- role: "user"
- Can: Only Read/Update their own profile
- Cannot: Access other users' profiles

Code Example (in userController.js):
const updateUserById = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  // Check authorization
  const isAdmin = req.user.role === "admin" || 
                  req.user.email === "admin@gmail.com";
  
  if (req.user.id !== userId && !isAdmin) {
    return res.status(403).json({ 
      error: "Forbidden: You can only update your own profile" 
    });
  }

  // If passed this check, user is either:
  // - Updating their own profile, OR
  // - Admin can update anyone
  // Continue with update...
};
```

### Access Control Summary

```
ACCESS CONTROL HIERARCHY:

1. PORT FIREWALL (First Check)
   ├─ Port 8000: Public
   └─ Ports 8001-8005: Internal Only

2. PUBLIC vs PROTECTED (Second Check)
   ├─ Public Endpoints:
   │  ├─ POST /api/users/register
   │  ├─ POST /api/users/login
   │  ├─ GET  /health
   │  └─ No token needed
   │
   └─ Protected Endpoints:
      ├─ GET  /api/users/me
      ├─ PUT  /api/users/:id
      ├─ POST /api/payments
      └─ JWT token REQUIRED

3. ROLE-BASED (Third Check - If Applicable)
   ├─ Admin can do EVERYTHING
   └─ User can do LIMITED things

4. OWNERSHIP (Fourth Check - If Applicable)
   ├─ User can only access their own data
   └─ Admin can access anyone's data
```

### Real-World Scenario

```
Scenario: Can a hacker access Payment Service directly?

Hacker: "I'll directly call Payment Service"
  curl http://localhost:8005/api/payments

Step 1: Port Check
  ❌ Firewall: "Port 8005 not open from internet"
  Result: Connection refused

---

Scenario: What if someone accesses through API Gateway?

Person: "I want to see all payments"
  GET http://localhost:8000/api/payments

Step 1: Port Check
  ✓ Port 8000 is open
  
Step 2: Public/Protected Check
  ❌ This endpoint requires JWT token
  
Step 3: No Token Provided
  Response: 401 Unauthorized
  { "error": "No token provided" }

---

Scenario: Someone gets valid JWT token

Person: "I have a JWT token!"
  GET http://localhost:8000/api/payments
  Headers: Authorization: Bearer <valid_token>

Step 1: Port Check
  ✓ Port 8000 is open
  
Step 2: Token Check
  ✓ Token is valid
  
Step 3: Role Check
  ✓ User is authenticated
  
Result: ✓ CAN ACCESS
  They see their payments

BUT:

Scenario: User tries to see another user's payment

User 5: "Show me payments for user 3"
  GET http://localhost:8000/api/payments?user_id=3
  Headers: Authorization: Bearer <token>

Step 1-3: All pass

Step 4: Ownership/Authorization Check
  ❌ User 5 is not Admin
  ❌ This is not their own payment
  
Response: 403 Forbidden
{ "error": "You cannot access other users' payments" }
```

### Security Levels in Your Project

| Endpoint | Public? | Authentication? | Authorization? | Who Can Access? |
|----------|---------|-----------------|-----------------|-----------------|
| `POST /api/users/register` | ✓ Yes | ❌ No | N/A | Anyone |
| `POST /api/users/login` | ✓ Yes | ❌ No | N/A | Anyone |
| `GET /api/users/me` | ❌ No | ✓ Yes | ✓ Yes (owner) | Only logged-in users |
| `GET /api/users/:id` | ❌ No | ✓ Yes | ✓ Yes (owner/admin) | Owner or Admin |
| `PUT /api/users/:id` | ❌ No | ✓ Yes | ✓ Yes (owner/admin) | Owner or Admin |
| `DELETE /api/users/:id` | ❌ No | ✓ Yes | ✓ Yes (admin only) | Admin Only |
| `GET /api/payments` | ❌ No | ✓ Yes | ✓ Yes | Authenticated Users |
| `POST /api/payments` | ❌ No | ✓ Yes | ✓ Yes | Authenticated Users |

---

## Summary: Key Takeaways

### 1. API Gateway Advantage
- Single entry point (port 8000)
- Services hidden from direct access
- Centralized security and logging
- Easy to modify backends without breaking clients

### 2. Service Endpoints
- Located in `routes/` files of each service
- Business logic in `controllers/` files
- Data stored in `models/data.js` (in-memory)

### 3. Validation Layers
- **Middleware**: JWT token verification
- **Controller**: Input validation, business logic
- **Database**: Uniqueness checks (emails, IDs)

### 4. In-Memory Database
- Data stored in JavaScript arrays in RAM
- Fast but not persistent
- Lost when server restarts
- Good for MVP/development, not for production

### 5. Different Ports
- Each service has unique port (8000-8005)
- Clients only access port 8000 (API Gateway)
- Services communicate with each other on internal ports

### 6. Service Communication
- **External** (clients) → Talk to API Gateway only
- **Internal** (services) → Use HTTP to talk to each other
- Payment Service example: calls Order Service to verify order

### 7. Security & Access Control
- **Layer 1**: Firewall/Port access
- **Layer 2**: JWT token authentication  
- **Layer 3**: Role-based authorization (admin vs user)
- **Layer 4**: Data ownership checks
