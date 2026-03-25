const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserById,
  createUser,
  getUserForResponse,
  updateUser,
  deleteUser,
  getAllUsers,
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
    { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
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

/**
 * Update user by ID
 * PUT /api/users/:id
 * Protected route
 */
const updateUserById = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  // Authorize: Only the user can update their own profile OR admin
  const isAdmin = req.user.role === "admin" || req.user.email === "admin@gmail.com";
  if (req.user.id !== userId && !isAdmin) {
    return res.status(403).json({ error: "Forbidden: You can only update your own profile" });
  }

  const { name, email, password, phone, address } = req.body;
  
  if (email) {
    const existing = findUserByEmail(email);
    if (existing && existing.id !== userId) {
      return res.status(409).json({ error: "Email already in use by another account" });
    }
  }

  const updated = updateUser(userId, { name, email, password, phone, address });
  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: getUserForResponse(updated),
  });
};

/**
 * Delete user by ID
 * DELETE /api/users/:id
 * Protected route
 */
const deleteUserById = (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const isAdmin = req.user.role === "admin" || req.user.email === "admin@gmail.com";
  if (req.user.id !== userId && !isAdmin) {
    return res.status(403).json({ error: "Forbidden: You can only delete your own profile" });
  }

  const success = deleteUser(userId);
  if (!success) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};

/**
 * Get all users
 * GET /api/users
 * Protected route
 */
const getAllUsersHandler = (req, res) => {
  // Restrict to admin only
  const isAdmin = req.user.role === "admin" || req.user.email === "admin@gmail.com";
  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden: Only admins can view all users" });
  }

  const users = getAllUsers();
  
  return res.status(200).json({
    success: true,
    count: users.length,
    users: users,
  });
};

module.exports = {
  register,
  login,
  getMe,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsersHandler,
};
