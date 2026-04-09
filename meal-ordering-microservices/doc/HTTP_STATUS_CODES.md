# HTTP Status Codes in Meal Ordering Microservices

## Overview

HTTP Status Codes are **3-digit numbers** that tell the client (browser/app) the result of their request. They're part of the HTTP protocol and follow a standard format.

```
Status Code: XXX
             │││
             ││└─ Specific error (0-9)
             │└── General category (0-9)
             └─── Response class (1-5)
```

---

## Table of Contents

1. [Status Code Ranges](#status-code-ranges)
2. [Your Project's Status Codes](#your-projects-status-codes)
3. [Detailed Explanations](#detailed-explanations)
4. [Usage in Your Microservices](#usage-in-your-microservices)
5. [Reference Table](#reference-table)

---

## Status Code Ranges

HTTP status codes are divided into 5 categories based on the first digit:

| Range   | Category      | Meaning                                 |
| ------- | ------------- | --------------------------------------- |
| **1xx** | Informational | Request received, processing continuing |
| **2xx** | Success       | Request successful ✓                    |
| **3xx** | Redirection   | Further action needed                   |
| **4xx** | Client Error  | Client's mistake ✗                      |
| **5xx** | Server Error  | Server's fault ✗                        |

---

## Your Project's Status Codes

Your microservices project uses these specific status codes:

```
200 - OK (Success)
201 - Created (Success - Resource Created)
400 - Bad Request (Client Error)
401 - Unauthorized (Authentication Error) token required
403 - Forbidden (Authorization Error) permission (token)
404 - Not Found (Resource doesn't exist)
409 - Conflict (Resource already exists) email
500 - Internal Server Error (Server Error)
```

**In this documentation, we focus on:**

- ✓ **200** → Request successful
- ✓ **201** → New resource created
- ✗ **400** → Client sent bad data

---

## Detailed Explanations

### 200 - OK (Success - Found and Returned)

**Status Code:** `200`  
**Category:** 2xx (Success)  
**Meaning:** Request successful, data returned

#### What It Means:

```
Client says: "Server, get me the user with ID 5"
Server says: "✓ OK! I found it and here it is"

Response Code: 200
Response Body: { user data }
```

#### Real-World Analogy:

```
You: "Do you have coffee?"
Barista: "Yes, here's your coffee" ← 200 OK
         (Returns the coffee)
```

#### When Used in Your Project:

| Endpoint              | Scenario                                 | Example                                                       |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| `GET /api/users/me`   | User logged in, requesting their profile | Returns: `{ id: 1, name: "John", email: "john@example.com" }` |
| `GET /api/payments`   | Fetching all payments                    | Returns: `[ { id: 1, amount: 49.99 }, ... ]`                  |
| `GET /api/orders/:id` | Getting specific order details           | Returns: `{ id: 5, total_price: 99.99, status: "pending" }`   |
| `GET /api/menu`       | Fetching menu items                      | Returns: `[ { id: 1, name: "Pizza", price: 12.99 }, ... ]`    |
| `GET /health`         | Health check                             | Returns: `{ status: "Server is running" }`                    |

#### Code Example:

```javascript
// In userController.js - getMe function
const getMe = (req, res) => {
  // User is authenticated (token verified)
  // req.user contains their data

  const user = findUserById(req.user.id);

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });
};

// Client Request:
// GET http://localhost:8000/api/users/me
// Headers: Authorization: Bearer <token>

// Server Response:
// 200 OK
// {
//   "success": true,
//   "user": {
//     "id": 1,
//     "name": "John Doe",
//     "email": "john@example.com",
//     ...
//   }
// }
```

#### When You See 200:

✓ Request was successful  
✓ Data was found and returned  
✓ No errors occurred

---

### 201 - Created (Success - New Resource Created)

**Status Code:** `201`  
**Category:** 2xx (Success)  
**Meaning:** Request successful, new resource created

#### What It Means:

```
Client says: "Server, create this new user"
Server says: "✓ Created! Here's the new user with ID 5"

Response Code: 201
Response Body: { new user data }
```

#### Real-World Analogy:

```
You: "Create a new bank account for me"
Bank: "Done! Here's your new account number: 123456" ← 201 Created
      (New resource created)
```

#### When Used in Your Project:

| Endpoint                   | Scenario                  | Example                                                              |
| -------------------------- | ------------------------- | -------------------------------------------------------------------- |
| `POST /api/users/register` | Creating new user account | Creates user and returns: `{ userId: 2, name: "Jane" }`              |
| `POST /api/payments`       | Creating new payment      | Creates payment and returns: `{ id: 1, order_id: 5, amount: 49.99 }` |
| `POST /api/orders`         | Creating new order        | Creates order and returns: `{ id: 10, total_price: 99.99 }`          |

#### Code Example:

```javascript
// In userController.js - register function
const register = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validation...
  if (!name || !email || !password) {
    return res.status(400).json({ error: "required fields missing" });
  }

  // Create new user in database
  const user = createUser(name, email, password, phone || "", address || "");

  // Return 201 with new user data
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

// Client Request:
// POST http://localhost:8000/api/users/register
// {
//   "name": "Jane Smith",
//   "email": "jane@example.com",
//   "password": "pass123"
// }

// Server Response:
// 201 Created
// {
//   "success": true,
//   "message": "User registered successfully",
//   "userId": 2,
//   "user": {
//     "id": 2,
//     "name": "Jane Smith",
//     "email": "jane@example.com"
//   }
// }
```

#### 200 vs 201:

```
When to use 200:
- Updating existing resource
- Fetching data
- Getting confirmation

Example:
PUT /api/users/5  → Update user 5 → 200 OK (updated)

---

When to use 201:
- Creating NEW resource
- Resource didn't exist before

Example:
POST /api/users  → Create new user → 201 Created (new)
```

#### When You See 201:

✓ Request was successful  
✓ New resource was created  
✓ Resource has an ID (check the response for it)

---

### 400 - Bad Request (Client Error)

**Status Code:** `400`  
**Category:** 4xx (Client Error)  
**Meaning:** Client sent invalid/incomplete data

#### What It Means:

```
Client says: "Server, create user: { email: 'john@gmail.com' }"
           (missing name and password!)
Server says: "✗ Bad Request! You forgot required fields"

Response Code: 400
Response Body: { error: "name, email, and password are required" }
```

#### Real-World Analogy:

```
You: "Buy me 2 pizzas" (but don't tell which pizzas)
Restaurant: "Bad Request! Which pizzas do you want?" ← 400 Bad Request
           (Your request was incomplete)
```

#### When Used in Your Project:

| Endpoint                   | Why 400                                       | Example                                                                           |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `POST /api/users/register` | Missing required fields (name/email/password) | Response: `{ error: "name, email, and password are required" }`                   |
| `POST /api/users/login`    | Missing email or password                     | Response: `{ error: "email and password are required" }`                          |
| `POST /api/payments`       | Invalid payment_method or missing order_id    | Response: `{ error: "order_id and payment_method are required" }`                 |
| `POST /api/payments`       | Payment method not in allowed list            | Response: `{ error: "Invalid payment_method. Allowed: card, cash, online" }`      |
| `POST /api/payments`       | Order status is not "pending"                 | Response: `{ error: "Cannot process payment for order with status 'completed'" }` |

#### Code Examples:

##### Example 1: Missing Required Fields

```javascript
// In userController.js - register function
const register = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Check: Are name, email, password provided?
  if (!name || !email || !password) {
    // ✗ No! Send 400 Bad Request
    return res.status(400).json({
      error: "name, email, and password are required",
    });
  }

  // Continue if all required fields present...
};

// Bad Request from Client:
// POST http://localhost:8000/api/users/register
// {
//   "name": "John Doe"
//   // Missing: email and password
// }

// Server Response:
// 400 Bad Request
// {
//   "error": "name, email, and password are required"
// }
```

##### Example 2: Invalid Value

```javascript
// In paymentController.js - processPayment function
const processPayment = async (req, res) => {
  const { order_id, payment_method } = req.body;

  // Check: Is payment_method valid?
  const validMethods = ["card", "cash", "online"];
  if (!validMethods.includes(payment_method)) {
    // ✗ No! Send 400 Bad Request
    return res.status(400).json({
      success: false,
      message: "Invalid payment_method. Allowed: card, cash, online",
    });
  }

  // Continue if payment_method is valid...
};

// Bad Request from Client:
// POST http://localhost:8000/api/payments
// {
//   "order_id": 5,
//   "payment_method": "bitcoin"  // NOT in allowed list!
// }

// Server Response:
// 400 Bad Request
// {
//   "success": false,
//   "message": "Invalid payment_method. Allowed: card, cash, online"
// }
```

##### Example 3: Order Status Not Valid

```javascript
// In paymentController.js
const processPayment = async (req, res) => {
  // ... validation ...

  // Check: Is order status "pending"?
  const orderData = orderResponse.data.order || orderResponse.data;
  if (orderData.status !== "pending") {
    // ✗ Order already processed! Send 400 Bad Request
    return res.status(400).json({
      success: false,
      message: `Cannot process payment for order with status '${orderData.status}'. Must be 'pending'.`,
    });
  }

  // Continue if order status is "pending"...
};

// Bad Request from Client:
// POST http://localhost:8000/api/payments
// {
//   "order_id": 5,        // This order already paid!
//   "payment_method": "card"
// }

// Server Response:
// 400 Bad Request
// {
//   "success": false,
//   "message": "Cannot process payment for order with status 'completed'. Must be 'pending'."
// }
```

#### When You See 400:

✗ Your request had invalid data  
✗ Some required fields are missing  
✗ Some values don't match expected format  
✗ **Your fault - fix the request and try again**

---

## Usage in Your Microservices

### Status Code Occurrences

Found **20 occurrences** in `ARCHITECTURE_FAQ.md`:

#### 200 OK (1 occurrence)

**Line 312**: User login success response

```javascript
const login = (req, res) => {
  // ... validation ...

  // After successful login
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: getUserForResponse(user),
  });
};
```

#### 201 Created (8+ occurrences)

**Lines 148, 262, 385, 554**: User registration and payment creation

```javascript
// Line 148, 262 - User registration
return res.status(201).json({
  success: true,
  message: "User registered successfully",
  userId: user.id,
});

// Line 385, 554 - Payment creation
res.status(201).json({
  success: true,
  message: "Payment processed successfully",
  payment: newPayment,
});
```

#### 400 Bad Request (11+ occurrences)

**Lines 141, 247, 285, 332, 341, 366, 402, 405, 407**: Various validation failures

- Line 141: Required fields missing
- Line 247: Login email/password not provided
- Line 285: Password doesn't match
- Line 332: Order validation fails
- Line 341: Invalid payment method
- Line 366: Order status not "pending"
- Lines 402, 405, 407: Validation summary table

---

## Reference Table

### Complete HTTP Status Code Reference for Your Project

| Code    | Status       | Category       | Meaning                           | Example Scenario                                      |
| ------- | ------------ | -------------- | --------------------------------- | ----------------------------------------------------- |
| **200** | OK           | ✓ Success      | Request successful, data returned | `GET /api/users/me` - Returns current user            |
| **201** | Created      | ✓ Success      | New resource created              | `POST /api/users/register` - New user account created |
| **400** | Bad Request  | ✗ Client Error | Invalid/missing data from client  | `POST /api/users/register` without email field        |
| 401     | Unauthorized | ✗ Client Error | No/invalid authentication token   | `GET /api/users/me` without JWT token                 |
| 403     | Forbidden    | ✗ Client Error | Authenticated but no permission   | User tries to access another user's profile           |
| 404     | Not Found    | ✗ Client Error | Resource doesn't exist            | `GET /api/users/999` - User 999 doesn't exist         |
| 409     | Conflict     | ✗ Client Error | Resource already exists           | Register with email that already exists               |
| 500     | Server Error | ✗ Server Error | Server crashed/error              | Unexpected server-side error                          |

---

## Client-Side Handling

### How Frontend Should Handle Each Status Code

```javascript
// Pseudo-code for frontend handling

fetch("http://localhost:8000/api/users/register", {
  method: "POST",
  body: JSON.stringify({
    name: "John",
    email: "john@example.com",
    password: "pass123",
  }),
}).then((response) => {
  if (response.status === 201) {
    // ✓ Success! New user created
    console.log("Account created successfully");
    navigate("/login");
  } else if (response.status === 400) {
    // ✗ Client error - show error message
    const data = response.json();
    alert("Error: " + data.error);
    // Example: "Error: email already registered"
  } else if (response.status === 409) {
    // ✗ Resource exists
    alert("Email already registered");
  } else if (response.status === 500) {
    // ✗ Server error
    alert("Server error. Please try again later.");
  }
});
```

---

## Summary

### Quick Reference

```
✓ 200 OK
  Means: Request worked, here's your data
  When: GET, PUT requests succeed
  Action: Process the data normally

✓ 201 Created
  Means: Request worked, new thing created
  When: POST requests succeed
  Action: Show success message, update UI

✗ 400 Bad Request
  Means: Your data was wrong/incomplete
  When: Validation fails on client's input
  Action: Show error message, ask user to fix input

✗ Other 4xx codes
  Means: Client's request had issues
  Action: Check authentication, permissions, existence

✗ 5xx Server Error
  Means: Server crashed/failed
  Action: Retry later or contact support
```

### In Your Meal Ordering System

```
User Registration Flow:
1. User fills form: name, email, password
2. Frontend sends: POST /api/users/register
3. Server validates:
   - Has all required fields?
   - Is email unique?
4. If valid → 201 Created (new account!)
5. If invalid → 400 Bad Request (fix your data!)

Payment Processing Flow:
1. User clicks "Pay"
2. Frontend sends: POST /api/payments with order_id
3. Server validates:
   - Does order exist?
   - Is order status "pending"?
   - Is payment method valid?
4. If valid → 201 Created (payment processed!)
5. If invalid → 400 Bad Request (cannot process)
```
