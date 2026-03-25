# User Service API Documentation

## 🚀 Quick Start

### 1. Start the User Service

```bash
cd user-service
npm install  # (if not already done)
npm start
```

You should see:

```
User Service running on port 8001
```

### 2. Access Swagger UI

Open your browser and visit:

```
http://localhost:8001/api-docs
```

---

## 📝 How to Register a User in Swagger

### Step 1: Navigate to the Register Endpoint

1. Open http://localhost:8001/api-docs
2. Scroll down to find **POST /api/users/register**
3. Click on it to expand

### Step 2: Click "Try it out"

- Look for the **Try it out** button on the right side
- Click it to enable request testing

### Step 3: Enter Registration Data

In the **Request body** section, you'll see a text area. Enter JSON:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main Street, City, State"
}
```

**Required fields:**

- `name` (string)
- `email` (string) - Must be unique
- `password` (string)

**Optional fields:**

- `phone` (string)
- `address` (string)

### Step 4: Click "Execute"

- Click the blue **Execute** button
- Wait for the response

### Step 5: View the Response

You should see a **201 Created** response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, City, State"
  }
}
```

---

## 🔐 How to Login and Get JWT Token

### Step 1: Find the Login Endpoint

1. On Swagger UI, find **POST /api/users/login**
2. Click **Try it out**

### Step 2: Enter Login Credentials

In the request body, enter:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Step 3: Execute and Get Token

Click **Execute**. You'll receive:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzExMzU0NDAwLCJleHAiOjE3MTE0NDA4MDB9.abcdefg...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, City, State"
  }
}
```

**Copy the token value** (without quotes)

---

## 🔑 How to Use JWT Token for Protected Endpoints

### Step 1: Click the Authorize Button

1. At the top of Swagger UI, look for the **Authorize** button (🔒 icon)
2. Click it

### Step 2: Paste Your Token

A dialog appears. In the text field, paste:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzExMzU0NDAwLCJleHAiOjE3MTE0NDA4MDB9.abcdefg...
```

**Important:** Include the word **"Bearer "** before the token.

### Step 3: Click Authorize

- Click the **Authorize** button in the dialog
- You'll see a success message
- Click **Close**

---

## 📚 Testing Protected Endpoints

Now you can test protected endpoints:

### Get Current User Profile

1. Find **GET /api/users/me**
2. Click **Try it out**
3. Click **Execute**

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, City, State"
  }
}
```

### Get User by ID

1. Find **GET /api/users/{id}**
2. Click **Try it out**
3. Enter `1` in the **id** field
4. Click **Execute**

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, City, State"
  }
}
```

---

## ❌ Common Errors & Solutions

### 401 Unauthorized - "No token provided"

**Problem:** You tried to access a protected endpoint without a token.

**Solution:**

1. Login first to get a JWT token
2. Click **Authorize** and paste your token with "Bearer " prefix
3. Try again

### 401 Unauthorized - "Invalid token"

**Problem:** Token is expired or malformed.

**Solution:**

1. Login again to get a fresh token
2. Make sure you copied the entire token
3. Ensure "Bearer " is included

### 409 Conflict - "Email already registered"

**Problem:** You tried to register with an email that already exists.

**Solution:**

- Use a different email address
- Or login with the existing email

### 404 Not Found - "User not found"

**Problem:** User ID doesn't exist.

**Solution:**

- Register a new user first
- Use the correct user ID from registration response

---

## 📋 Endpoint Summary

| Method | Endpoint              | Protected | Description              |
| ------ | --------------------- | --------- | ------------------------ |
| POST   | `/api/users/register` | ❌        | Register new user        |
| POST   | `/api/users/login`    | ❌        | Login & get JWT token    |
| GET    | `/api/users/me`       | ✅        | Get current user profile |
| GET    | `/api/users/:id`      | ✅        | Get user by ID           |

---

## 🧪 Complete Testing Workflow

1. **Register a user**
   - POST `/api/users/register`
   - Use unique email

2. **Login to get token**
   - POST `/api/users/login`
   - Copy the token

3. **Authorize in Swagger**
   - Click 🔒 Authorize button
   - Paste: `Bearer {token}`

4. **Test protected endpoints**
   - GET `/api/users/me`
   - GET `/api/users/1`

---

## 📌 User Object Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main Street, City, State"
}
```

**Note:** Password is stored as plain text (MVP only - NOT for production)

---

## 🔗 Related Services

- **API Gateway:** http://localhost:8000
- **User Service:** http://localhost:8001
- **Order Service:** http://localhost:8004
- **Payment Service:** http://localhost:8005

---

## 💡 Tips

- Use different email addresses for each test user
- Token expires in **24 hours**
- To test again, either login or clear the token in Authorize
- All endpoints return JSON responses
- Status codes follow REST conventions

---

**Last Updated:** March 25, 2026
