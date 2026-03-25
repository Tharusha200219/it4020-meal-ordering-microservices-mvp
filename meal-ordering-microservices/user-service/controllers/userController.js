const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserById,
  createUser,
  getUserForResponse,
} = require("../models/data");

/**
 * Register a new user
 * POST /api/users/register
 */
const register = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }

  // Check if email already exists
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Create user
  const user = createUser(name, email, password, phone || "", address || "");

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user.id,
    user: getUserForResponse(user),
  });
};

/**
 * Login user
 * POST /api/users/login
 */
const login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Verify password (plain text comparison for MVP)
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: getUserForResponse(user),
  });
};

/**
 * Get current user from JWT
 * GET /api/users/me
 * Protected route
 */
const getMe = (req, res) => {
  const user = findUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    success: true,
    user: getUserForResponse(user),
  });
};

/**
 * Get user by ID
 * GET /api/users/:id
 * Protected route (used internally by Order Service)
 */
const getUserById = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    success: true,
    user: getUserForResponse(user),
  });
};

module.exports = {
  register,
  login,
  getMe,
  getUserById,
};
