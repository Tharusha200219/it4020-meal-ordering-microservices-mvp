# Payment Service API Documentation

## 🚀 Quick Start

### 1. Start All Required Services

Make sure these are running:

```bash
# Terminal 1 - User Service (needed for JWT tokens)
cd user-service
npm start

# Terminal 2 - Order Service (payment fetches orders from here)
cd ../order-service
npm start

# Terminal 3 - Payment Service
cd ../payment-service
npm start
```

You should see:

```
User Service running on port 8001
Order Service running on port 8004
Payment Service running on port 8005
```

### 2. Access Swagger UI

Open your browser and visit:

```
http://localhost:8005/api-docs
```

---

## 📝 How to Process a Payment in Swagger

### Prerequisites

Before processing a payment, you need:

1. **JWT Token** (from User Service)
2. **Order ID** (from Order Service)
3. **Order must have status="pending"**

---

## Step-by-Step: Register → Login → Create Order → Process Payment

### Step 1: Register & Login (User Service)

1. Go to http://localhost:8001/api-docs
2. POST `/api/users/register`
   - Click **Try it out**
   - Enter:

   ```json
   {
     "name": "Jane Doe",
     "email": "jane@example.com",
     "password": "password123",
     "phone": "+9876543210",
     "address": "456 Oak Ave, City"
   }
   ```

   - Click **Execute**

3. POST `/api/users/login`
   - Click **Try it out**
   - Enter:
   ```json
   {
     "email": "jane@example.com",
     "password": "password123"
   }
   ```

   - Click **Execute**
   - **Copy the token** from the response

### Step 2: Create an Order (Order Service)

1. Go to http://localhost:8004/api-docs
2. Click **Authorize** 🔒, paste: `Bearer {your_token}`
3. POST `/api/orders`
   - Click **Try it out**
   - Enter:
   ```json
   {
     "user_id": 1,
     "items": [
       {
         "menu_id": 1,
         "name": "Burger",
         "quantity": 2,
         "price": 5.99
       }
     ],
     "total_price": 11.98
   }
   ```

   - Click **Execute**
   - **Note the order_id** from response (usually 1 for first order)

### Step 3: Process Payment

1. Go to http://localhost:8005/api-docs
2. Click **Authorize** 🔒, paste: `Bearer {same_token}`
3. POST `/api/payments`
   - Click **Try it out**
   - Enter:
   ```json
   {
     "order_id": 1,
     "payment_method": "card"
   }
   ```

   - **payment_method options:** "card", "cash", "online"
   - Click **Execute**

### Step 4: View Response

**201 Created:**

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": 11.98,
    "payment_method": "card",
    "status": "completed",
    "created_at": "2026-03-25T10:30:45.123Z"
  }
}
```

---

## 🔍 How to Get a Payment

### Find Payment by Order ID

1. Go to http://localhost:8005/api-docs
2. Make sure you're **Authorized** with JWT token
3. GET `/api/payments/{order_id}`
   - Click **Try it out**
   - Enter order ID (e.g., `1`) in the **order_id** field
   - Click **Execute**

**200 OK Response:**

```json
{
  "success": true,
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": 11.98,
    "payment_method": "card",
    "status": "completed",
    "created_at": "2026-03-25T10:30:45.123Z"
  }
}
```

---

## ❌ Common Errors & Solutions

### 401 Unauthorized - "No token provided"

**Problem:** Missing JWT token

**Solution:**

1. Get token from User Service login
2. Click **Authorize** 🔒
3. Paste: `Bearer {token}`

### 404 Not Found - "Order not found"

**Problem:** Order ID doesn't exist in Order Service

**Solution:**

- Create an order first in Order Service
- Use the correct order_id from the order response

### 400 Bad Request - "Order status is completed/confirmed/..."

**Problem:** Order must have status="pending" to process payment

**Solution:**

- Only new orders have pending status
- Create a fresh order
- Check order status in Order Service first

### 409 Conflict - "Payment already exists for this order"

**Problem:** A payment has already been processed for this order

**Solution:**

- Use a different order_id
- Or create a new order

### 503 Service Unavailable - "Order Service is unavailable"

**Problem:** Order Service is not running

**Solution:**

- Make sure Order Service is running: `cd order-service && npm start`
- Check that it's listening on port 8004

---

## 📋 Endpoint Summary

| Method | Endpoint                   | Protected | Description               |
| ------ | -------------------------- | --------- | ------------------------- |
| POST   | `/api/payments`            | ✅        | Process payment for order |
| GET    | `/api/payments/{order_id}` | ✅        | Get payment by order ID   |

---

## 📌 Payment Object Structure

```json
{
  "id": 1,
  "order_id": 1,
  "amount": 11.98,
  "payment_method": "card",
  "status": "completed",
  "created_at": "2026-03-25T10:30:45.123Z"
}
```

**Payment Methods:** `card`, `cash`, `online`

**Payment Statuses:** `pending`, `completed`, `failed`

---

## 🎯 Request/Response Examples

### Process Payment - Request

```json
{
  "order_id": 1,
  "payment_method": "online"
}
```

### Process Payment - Response (201 Created)

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": 25.5,
    "payment_method": "online",
    "status": "completed",
    "created_at": "2026-03-25T10:35:20.456Z"
  }
}
```

### Get Payment - Request

`GET /api/payments/1`

### Get Payment - Response (200 OK)

```json
{
  "success": true,
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": 25.5,
    "payment_method": "online",
    "status": "completed",
    "created_at": "2026-03-25T10:35:20.456Z"
  }
}
```

---

## 🧪 Complete Testing Workflow

```
1. Start Services
   ├─ User Service (8001)
   ├─ Order Service (8004)
   └─ Payment Service (8005)

2. Register & Login (User Service)
   └─ Get JWT Token

3. Create Order (Order Service)
   ├─ Use JWT Token
   └─ Note order_id

4. Process Payment (Payment Service)
   ├─ Use same JWT Token
   ├─ Use order_id from step 3
   └─ Choose payment_method

5. View Payment (Payment Service)
   ├─ Use same JWT Token
   └─ Query payment by order_id
```

---

## 🔗 Service Integration

**How Payment Service Works:**

1. Client sends: `POST /api/payments` with order_id
2. Payment Service calls: `GET /api/orders/{order_id}` to Order Service
3. Validates: Order exists and status="pending"
4. Extracts: `total_price` from order
5. Creates: Payment with status="completed"
6. Returns: Payment details

---

## 💡 Tips

- **Always start services in correct order:** User → Order → Payment
- **Same JWT token** works across all protected endpoints
- **Token expires in 24 hours** - login again after expiration
- **Payment method** must be one of: "card", "cash", "online"
- **Order status** must be "pending" to process payment
- Use **order_id=1** for first test (order must exist)

---

## 🔐 Authorization

All Payment Service endpoints require JWT Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to authorize in Swagger:**

1. Click **Authorize** button 🔒
2. Paste: `Bearer {token}`
3. Click **Authorize**
4. Click **Close**

---

## 🚨 Important Notes

- Payment Service **depends on** Order Service
- Order Service **depends on** User Service
- **All three must be running** for payment processing
- Payments are stored **in-memory** (not persistent)
- Restarting service **clears all data**

---

**Last Updated:** March 25, 2026
