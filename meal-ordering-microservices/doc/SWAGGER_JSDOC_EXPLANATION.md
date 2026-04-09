# Swagger JSDoc Documentation Guide

## What are These Blocks?

```javascript
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     ...
 */
router.post("/register", register);
```

These are **JSDoc comments with @swagger annotations** that describe your API endpoints. They're used to automatically generate interactive API documentation.

---

## Why Use Swagger Documentation?

### Problems Without Documentation
```
Problem 1: Developers don't know what endpoints exist
Problem 2: Don't know what data to send (request format)
Problem 3: Don't know what response will look like
Problem 4: Manual testing is slow
Problem 5: Have to ask other developers "how does this endpoint work?"
```

### Solutions With Swagger
```
✓ Interactive API documentation (Swagger UI)
✓ Clear endpoint descriptions
✓ Sample request/response formats
✓ Can test endpoints directly from browser
✓ Auto-generated from code comments
✓ Always stays in sync with code
✓ Other developers understand API instantly
```

---

## How It Works

### Process Flow

```
1. Write @swagger comments in routes
   ↓
2. swagger-jsdoc reads all @swagger comments
   ↓
3. Converts to OpenAPI/Swagger JSON format
   ↓
4. swagger-ui-express displays it as interactive UI
   ↓
5. Available at http://localhost:8001/api-docs
```

### Visual Flow

```
userRoutes.js (with @swagger comments)
    │
    ├─ swagger.js (configuration)
    │    └─ calls swaggerJsdoc(swaggerOptions)
    │
    ├─ swagger-jsdoc (reads comments)
    │    └─ generates OpenAPI JSON
    │
    ├─ server.js (sets up UI)
    │    └─ app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    │
    └─ Swagger UI displays at /api-docs
         ├─ Interactive documentation
         ├─ Try it out button
         └─ Test endpoints in browser
```

---

## Breaking Down a Swagger Block

### Example: Register Endpoint

```javascript
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main St, City"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: number
 *                 user:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
 */
router.post("/register", register);
```

### Breaking It Down Line by Line

#### Line 1: Start Swagger Comment
```javascript
/**
```
- Standard JSDoc comment start
- **/** (with 2 asterisks) not /* (single asterisk)

#### Line 2: Mark as Swagger
```javascript
 * @swagger
```
- `@swagger` tells swagger-jsdoc this is an API documentation block
- Without this, the comment is ignored

#### Line 3-4: Endpoint Path and Method
```javascript
 * /api/users/register:
 *   post:
```
- `/api/users/register:` - The endpoint path (colon at end is YAML syntax)
- `post:` - HTTP method (POST request)
- Other methods: `get:`, `put:`, `delete:`, `patch:`

#### Line 5: Summary
```javascript
 *     summary: Register a new user
```
- **summary**: Short description of what endpoint does
- Shows in endpoint list in Swagger UI
- Max 1-2 sentences

#### Line 6: Tags
```javascript
 *     tags: [Users]
```
- **tags**: Groups endpoints in Swagger UI
- Tag name: `[Users]`
- Endpoints with same tag grouped together
- Can have multiple tags: `[Users, Admin]`

#### Line 7-9: Request Body Container
```javascript
 *     requestBody:
 *       required: true
 *       content:
```
- **requestBody**: Describes what data client sends to endpoint
- **required: true** - Client MUST send a body (not optional)
- **content**: Types of content (usually JSON)

#### Line 10-12: JSON Content Type
```javascript
 *         application/json:
 *           schema:
 *             type: object
```
- `application/json:` - Data format is JSON
- `schema:` - Describes structure of data
- `type: object` - Data is an object (not array, string, etc.)

#### Line 13-15: Required Fields
```javascript
 *             required:
 *               - name
 *               - email
 *               - password
```
- **required**: List of fields that MUST be provided
- If client doesn't send these → error
- User can send phone and address optionally
- Swagger marks required fields with red asterisk (*)

#### Line 16-31: Field Properties
```javascript
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main St, City"
```
- **properties**: All possible fields
- **type: string** - Field is text
- **example**: Sample value shown in Swagger UI
- Swagger shows this in "Try it out" form

#### Line 32-47: Responses Container
```javascript
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: number
```
- **responses**: Describes what endpoint returns
- **201**: HTTP status code (201 = Created)
- **description**: What this response means
- **properties**: Fields in response object

#### Line 48-52: Error Responses
```javascript
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
```
- **400**: Bad Request status code
- **409**: Conflict status code (email exists)
- Each status code has description
- Developers see all possible responses

---

## Understanding OpenAPI/Swagger Syntax

### HTTP Methods
```yaml
get:        # Retrieve data
post:       # Create new data
put:        # Replace entire resource
patch:      # Update part of resource
delete:     # Remove data
```

### Data Types
```yaml
type: string        # Text: "John Doe"
type: number        # Integer: 123
type: integer       # Whole number: 42
type: boolean       # True/False: true
type: array         # List: [1, 2, 3]
type: object        # Complex: { key: value }
```

### HTTP Status Codes
```yaml
200  # OK - Success
201  # Created - New resource created
400  # Bad Request - Client error (invalid data)
401  # Unauthorized - Need authentication
403  # Forbidden - Don't have permission
404  # Not Found - Resource doesn't exist
409  # Conflict - Resource conflict (email exists)
500  # Internal Server Error - Server problem
```

---

## Real-World Example: Login Endpoint

### Swagger Comment
```javascript
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);
```

### What It Means
```
Endpoint: POST http://localhost:8001/api/users/login

INPUT (Request Body):
{
  "email": "john@example.com",  (REQUIRED)
  "password": "password123"     (REQUIRED)
}

OUTPUT (Success 200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}

OUTPUT (Error 401):
Invalid email or password
```

### How It Appears in Swagger UI
```
┌─────────────────────────────────────┐
│ Login user                           │ ← summary
├─────────────────────────────────────┤
│ POST /api/users/login                │ ← endpoint and method
├─────────────────────────────────────┤
│ Request body *                       │ ← required
│ ┌─────────────────────────────────┐ │
│ │ email * (required)              │ │
│ │ [john@example.com        ]      │ │ ← example value
│ │ password * (required)           │ │
│ │ [password123             ]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Try it out] [Clear]                │ ← Interactive buttons
├─────────────────────────────────────┤
│ Responses:                          │
│ ✓ 200 - Login successful            │
│ ✓ 401 - Invalid email or password   │
└─────────────────────────────────────┘
```

---

## Endpoint with Authentication

### Example: Get Current User (Protected)

```javascript
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []              ← Requires JWT token
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 */
router.get("/me", verifyToken, getMe);
```

### Key Difference: Security

```yaml
security:
  - bearerAuth: []
```

- **security**: This endpoint requires authentication
- **bearerAuth**: Type of security (JWT Bearer token)
- `[]` - Empty array means no additional scopes needed

### In Swagger UI
```
┌─────────────────────────────────────┐
│ Get current user profile            │
├─────────────────────────────────────┤
│ GET /api/users/me                    │
├─────────────────────────────────────┤
│ Authorize button appears! ↑         │ ← User must login first
│                                     │
│ [Try it out] [Clear]                │
└─────────────────────────────────────┘
```

---

## Endpoint with Path Parameters

### Example: Get User by ID

```javascript
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:                    ← URL parameters
 *       - in: path                   ← In the URL path
 *         name: id                   ← Parameter name
 *         required: true             ← Must be provided
 *         schema:
 *           type: number             ← Must be a number
 *         description: User ID       ← What it is
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, getUserById);
```

### Understanding Parameters

```yaml
parameters:
  - in: path          ← Location: in URL path
    name: id          ← Name: :id
    required: true    ← Must be provided
    schema:
      type: number    ← Must be number (not string)
```

### URL Examples
```
/api/users/1          ← id = 1 (number)
/api/users/5          ← id = 5 (number)
/api/users/john       ← id = john (would still be parsed as string in URL)
```

### In Swagger UI
```
┌─────────────────────────────────────┐
│ Get user by ID                      │
├─────────────────────────────────────┤
│ GET /api/users/{id}                  │
├─────────────────────────────────────┤
│ Path parameter:                     │
│ id * (required)                     │
│ [1                          ] ← Enter user ID
│                                     │
│ [Try it out] [Clear]                │
└─────────────────────────────────────┘
```

---

## How Swagger Uses Your Comments

### Step 1: Read Your Code
```javascript
// In userRoutes.js
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 */
router.post("/register", register);
```

### Step 2: Configuration Reads All Files
```javascript
// In swagger.js
apis: ["./routes/*.js"]  // Read all .js files in routes folder
```

### Step 3: Convert to JSON
```json
{
  "paths": {
    "/api/users/register": {
      "post": {
        "summary": "Register a new user",
        "tags": ["Users"],
        ...
      }
    }
  }
}
```

### Step 4: Display in UI
```
Browser opens http://localhost:8001/api-docs
    ↓
swagger-ui-express displays JSON as interactive UI
    ↓
Users see formatted documentation
```

---

## All Your Endpoints in Swagger Format

### Summary

| Endpoint | Method | Auth? | Description |
|----------|--------|-------|-------------|
| `/register` | POST | ❌ No | Create new user |
| `/login` | POST | ❌ No | User login, get token |
| `/me` | GET | ✓ Yes | Get current user |
| `/` | GET | ✓ Yes | Get all users |
| `/:id` | GET | ✓ Yes | Get user by ID |
| `/:id` | PUT | ✓ Yes | Update user |
| `/:id` | DELETE | ✓ Yes | Delete user |

### Visual in Swagger UI

```
┌─ Users ────────────────────────────────┐
│                                        │
│ POST    /api/users/register            │ ← Create
│ POST    /api/users/login               │ ← Authenticate
│ GET     /api/users/me                  │ ← Current user
│ GET     /api/users                     │ ← List all
│ GET     /api/users/{id}                │ ← Get one
│ PUT     /api/users/{id}                │ ← Update
│ DELETE  /api/users/{id}                │ ← Delete
│                                        │
└────────────────────────────────────────┘
```

---

## Testing in Swagger UI

### Example: Register User

1. Go to http://localhost:8001/api-docs
2. Click on "POST /api/users/register"
3. Click "Try it out"
4. Fill in the form:
   ```
   name: John Doe
   email: john@example.com
   password: password123
   phone: +1234567890
   address: 123 Main St
   ```
5. Click "Execute"
6. See response:
   ```json
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
   ```

---

## Why @swagger in Comments?

### Advantage 1: Stays in Sync
```
❌ Without @swagger (outdated docs):
   - Docs in separate file
   - Developer updates code
   - Forgets to update docs
   - Docs become wrong

✓ With @swagger (always correct):
   - Docs are IN the code
   - Update code → docs auto-update
   - Always in sync!
```

### Advantage 2: Easy to Write
```
Just plain text comments
No need to maintain separate documentation files
Everything in one place
```

### Advantage 3: Auto-Generated UI
```
swagger-jsdoc converts to OpenAPI JSON
swagger-ui-express displays as interactive docs
No manual HTML/CSS needed
Professional looking automatically
```

### Advantage 4: Interactive Testing
```
Instead of using curl/Postman:
curl -X POST http://localhost:8001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com",...}'

Just click in browser:
1. Go to http://localhost:8001/api-docs
2. Click "Try it out"
3. Fill form
4. Click Execute
5. See response
```

---

## Swagger vs Other Documentation Methods

### Without Swagger (Manual)
```
README.md:
  "POST /api/users/register
   Send: name, email, password
   Returns: 201 with user object"
```
- ❌ Text is easy to forget/outdated
- ❌ No examples
- ❌ Can't test
- ❌ Developers have to read file

### With Swagger
```
Swagger UI at /api-docs:
  - Form with examples
  - Try it out button
  - Test endpoints
  - See responses
  - Beautiful UI
```
- ✓ Always updated
- ✓ Examples shown
- ✓ Can test immediately
- ✓ Visual and interactive

---

## Summary

### What these blocks do:
1. **Describe** API endpoints
2. **Document** request/response format
3. **Generate** interactive documentation
4. **Enable** testing in browser
5. **Keep** docs always in sync with code

### Structure
```
@swagger
├─ Path & Method (/api/users/register, post)
├─ Summary (what it does)
├─ Tags (group endpoints)
├─ RequestBody (what to send)
│  ├─ required fields
│  └─ properties with types
├─ Responses (what you get back)
│  ├─ Status codes (200, 201, 400, 401, etc)
│  └─ Response body shapes
└─ Security (authentication requirements)
```

### Result
```
Interactive API documentation UI at http://localhost:8001/api-docs
├─ See all endpoints
├─ Try them out
├─ Test with different inputs
└─ Understand response formats
```

The `@swagger` comments are essentially a **specification of your API** written in your code that gets automatically converted to beautiful, interactive documentation! 📚✨
