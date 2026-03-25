# 🍔 Meal Ordering Microservices - Complete API Documentation

A complete microservices MVP for meal ordering with JWT authentication, API Gateway, and in-memory data storage.

---

## 📁 Project Structure

```
meal-ordering-microservices/
├── api-gateway/          (Port 8000) - API Gateway & Proxy
├── user-service/         (Port 8001) - User Management & Auth
├── restaurant-service/   (Port 8002) - Restaurant Management
├── menu-service/         (Port 8003) - Menu & Items
├── order-service/        (Port 8004) - Order Management
└── payment-service/      (Port 8005) - Payment Processing
```

---

## 🚀 Quick Start

### 1. Install Dependencies for All Services

```bash
cd meal-ordering-microservices

for dir in api-gateway user-service restaurant-service menu-service order-service payment-service; do
  (cd "$dir" && npm install && echo "✅ $dir done")
done
```

### 2. Start All Services (Open 6 Terminal Tabs)

```bash
# Terminal 1 - API Gateway
cd api-gateway && npm start
# Output: API Gateway running on port 8000

# Terminal 2 - User Service
cd ../user-service && npm start
# Output: User Service running on port 8001

# Terminal 3 - Restaurant Service
cd ../restaurant-service && npm start
# Output: Restaurant Service running on port 8002

# Terminal 4 - Menu Service
cd ../menu-service && npm start
# Output: Menu Service running on port 8003

# Terminal 5 - Order Service
cd ../order-service && npm start
# Output: Order Service running on port 8004

# Terminal 6 - Payment Service
cd ../payment-service && npm start
# Output: Payment Service running on port 8005
```

### 3. Access Swagger Documentation

| Service                | Swagger URL                    | Port |
| ---------------------- | ------------------------------ | ---- |
| **API Gateway**        | http://localhost:8000/api-docs | 8000 |
| **User Service**       | http://localhost:8001/api-docs | 8001 |
| **Restaurant Service** | http://localhost:8002/api-docs | 8002 |
| **Menu Service**       | http://localhost:8003/api-docs | 8003 |
| **Order Service**      | http://localhost:8004/api-docs | 8004 |
| **Payment Service**    | http://localhost:8005/api-docs | 8005 |

---

## 📚 Service Documentation

### [📖 User Service API Guide](./user-service/API_DOCUMENTATION.md)

- Register & Login
- JWT Authorization
- Get User Profile
- Full Swagger examples

### [💳 Payment Service API Guide](./payment-service/API_DOCUMENTATION.md)

- Process Payments
- Fetch Payments
- Order Integration
- Complete workflow examples

---

## 🔄 Complete End-to-End Workflow

### Scenario: Order & Pay for Meal

```
1. USER REGISTRATION (User Service)
   └─ POST /api/users/register
      ├─ Input: name, email, password, phone, address
      └─ Output: userId, JWT token ready

2. USER LOGIN (User Service)
   └─ POST /api/users/login
      ├─ Input: email, password
      └─ Output: JWT Token (needed for all protected endpoints)

3. VIEW RESTAURANTS (Restaurant Service)
   └─ GET /api/restaurants
      └─ Output: List of all restaurants (no auth needed)

4. VIEW MENUS (Menu Service)
   └─ GET /api/menus
      └─ Output: List of menu items for restaurants

5. CREATE ORDER (Order Service) ✅ PROTECTED
   └─ POST /api/orders
      ├─ Input: user_id, items[], total_price
      ├─ Auth: JWT Token
      └─ Output: order_id, status="pending"

6. PROCESS PAYMENT (Payment Service) ✅ PROTECTED
   └─ POST /api/payments
      ├─ Input: order_id, payment_method
      ├─ Auth: JWT Token
      ├─ Fetches order from Order Service
      └─ Output: payment_id, status="completed"

7. VIEW PAYMENT (Payment Service) ✅ PROTECTED
   └─ GET /api/payments/{order_id}
      ├─ Auth: JWT Token
      └─ Output: Payment details
```

---

## 🔐 Authentication & JWT

### How JWT Works

1. **User logs in** → Gets JWT token
2. **Token is valid for 24 hours**
3. **Send token with protected requests**: `Authorization: Bearer {token}`
4. **Protected endpoints** verify token and return user info

### Protected Endpoints (Require JWT)

- ✅ GET `/api/users/me` (Get current user)
- ✅ GET `/api/users/:id` (Get user by ID)
- ✅ POST `/api/orders` (Create order)
- ✅ GET `/api/orders` (Get orders)
- ✅ POST `/api/payments` (Process payment)
- ✅ GET `/api/payments/:order_id` (Get payment)

### Public Endpoints (No JWT Needed)

- ❌ POST `/api/users/register` (Register user)
- ❌ POST `/api/users/login` (Login user)
- ❌ GET `/api/restaurants` (View restaurants)
- ❌ GET `/api/menus` (View menus)

---

## 🧪 Testing in Swagger

### Quick Test (User Service)

1. Go to: http://localhost:8001/api-docs
2. **POST** `/api/users/register`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "phone": "+1234567890",
     "address": "123 Main St"
   }
   ```
3. **POST** `/api/users/login`
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. Copy the `token` from response
5. Click **Authorize** 🔒, paste: `Bearer {token}`
6. Test **GET** `/api/users/me`

---

## 📊 Service Dependencies

```
┌─────────────────────┐
│   API Gateway       │ (8000) - Routes all requests
└──────────┬──────────┘
           │ Proxies to:
     ┌─────┴─────┬──────────┬──────────┬──────────┐
     ▼           ▼          ▼          ▼          ▼
┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│ User    │ │Restaurant│ │ Menu   │ │  Order   │ │ Payment  │
│8001     │ │8002      │ │8003    │ │8004      │ │8005      │
└─────┬───┘ └──────────┘ └────────┘ └────┬─────┘ └────┬─────┘
      │                                   │            │
      │                    ┌──────────────┼────────────┘
      │                    │              │
      │         Fetches order from Order Service
      │         Verifies JWT from User Service
      │
      └─────────────────────────────────────────────────
```

---

## 💾 Data Models

### User

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

### Order

```json
{
  "id": 1,
  "user_id": 1,
  "items": [
    {
      "menu_id": 1,
      "name": "Burger",
      "quantity": 2,
      "price": 5.99
    }
  ],
  "total_price": 11.98,
  "status": "pending",
  "created_at": "2026-03-25T10:00:00.000Z"
}
```

### Payment

```json
{
  "id": 1,
  "order_id": 1,
  "amount": 11.98,
  "payment_method": "card",
  "status": "completed",
  "created_at": "2026-03-25T10:05:00.000Z"
}
```

---

## 🛠 Tech Stack

- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **API Documentation:** Swagger/OpenAPI (swagger-jsdoc, swagger-ui-express)
- **HTTP Client:** Axios (for inter-service communication)
- **CORS:** Enable cross-origin requests
- **Environment:** dotenv

---

## ⚠️ Important Notes

### In-Memory Storage

- All data is stored **in-memory** (RAM)
- **Data is lost** when service restarts
- **NOT for production** - use real database in production

### Service Dependencies

- Payment Service **requires** Order Service running
- Order Service **requires** User Service running
- **Start services in order:** User → Order → Payment

### JWT Token

- Token expires in **24 hours**
- Used for: `/api/users/me`, `/api/orders`, `/api/payments`
- Format: `Bearer {token}` in Authorization header

### Ports

- Ensure all ports (8000-8005) are available
- Change `.env` PORT variable if conflicts occur

---

## 🐛 Troubleshooting

### Kill All Node Processes

If you want to stop all running services at once:

```bash
# Kill all Node processes
pkill -9 node

# Or on some systems
killall -9 node
```

### Kill a Specific Port

If a specific port is stuck (e.g., port 8001):

```bash
# Kill process on port 8001
lsof -i :8001 -t | xargs kill -9
```

**What this does:**
- `lsof -i :8001` - Lists processes using port 8001
- `-t` - Returns only the process ID
- `xargs kill -9` - Kills that process forcefully

### Kill Multiple Ports at Once

```bash
# Kill all service ports (8000-8005)
for port in 8000 8001 8002 8003 8004 8005; do
  lsof -i :$port -t | xargs kill -9 2>/dev/null
done
echo "All service ports cleared"
```

### Check What's Running on a Port

Before killing, see what's using a port:

```bash
# Check specific port (e.g., 8001)
lsof -i :8001

# Check all ports
lsof -i :8000 -i :8001 -i :8002 -i :8003 -i :8004 -i :8005

# Or use netstat
netstat -an | grep 8001
```

### Service Won't Start

```bash
# Check if port is already in use
lsof -i :8001  # Check port 8001

# Kill process using port
kill -9 <PID>

# Or change PORT in .env file
```

### 503 Service Unavailable

**Problem:** Microservice is not running

**Solution:**

- Check all services are started
- Verify correct ports (8000-8005)
- Check console for error messages

### 401 Unauthorized

**Problem:** Missing or invalid JWT token

**Solution:**

1. Login to get token
2. Click **Authorize** in Swagger
3. Paste: `Bearer {token}`

### CORS Error

**Problem:** Frontend can't access API

**Solution:**

- All services have CORS enabled
- Make requests to `http://localhost:8000` (API Gateway)

---

## 📞 API Gateway Endpoints

Use API Gateway to access all services through single URL:

```
http://localhost:8000/api/users/*      → User Service (8001)
http://localhost:8000/api/restaurants/* → Restaurant Service (8002)
http://localhost:8000/api/menus/*       → Menu Service (8003)
http://localhost:8000/api/orders/*      → Order Service (8004)
http://localhost:8000/api/payments/*    → Payment Service (8005)
```

**Example:**

```bash
# Instead of: http://localhost:8001/api/users/register
# Use:        http://localhost:8000/api/users/register
```

---

## 🎯 Next Steps

1. **Start all 6 services** (see Quick Start)
2. **Read User Service guide** for authentication
3. **Read Payment Service guide** for full workflow
4. **Test endpoints** in Swagger UI
5. **Integrate with frontend** using API Gateway

---

## 📝 File Structure

```
meal-ordering-microservices/
├── README.md (this file)
├── api-gateway/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── swagger.js
│   └── routes/proxyRoutes.js
├── user-service/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── swagger.js
│   ├── API_DOCUMENTATION.md (Read this!)
│   ├── controllers/userController.js
│   ├── middleware/auth.js
│   ├── models/data.js
│   └── routes/userRoutes.js
├── payment-service/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── swagger.js
│   ├── API_DOCUMENTATION.md (Read this!)
│   ├── controllers/paymentController.js
│   ├── middleware/auth.js
│   ├── models/data.js
│   └── routes/paymentRoutes.js
└── [Other services...]
```

---

## 📖 Quick Links

- **User Service Docs:** [user-service/API_DOCUMENTATION.md](./user-service/API_DOCUMENTATION.md)
- **Payment Service Docs:** [payment-service/API_DOCUMENTATION.md](./payment-service/API_DOCUMENTATION.md)
- **User Service Swagger:** http://localhost:8001/api-docs
- **Payment Service Swagger:** http://localhost:8005/api-docs
- **API Gateway:** http://localhost:8000

---

**Last Updated:** March 25, 2026
**Status:** ✅ MVP Complete - Ready to Test
