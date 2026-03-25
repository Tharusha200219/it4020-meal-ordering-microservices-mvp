// In-memory users storage
let users = [];
let userIdCounter = 1;

// Find user by email
const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

// Find user by id
const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

// Create a new user
const createUser = (name, email, password, phone, address) => {
  const user = {
    id: userIdCounter++,
    name,
    email,
    password, // Plain text for MVP
    phone,
    address,
  };
  users.push(user);
  return user;
};

// Get user for login response (without password)
const getUserForResponse = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users (for debugging, if needed)
const getAllUsers = () => {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  }));
};

module.exports = {
  users,
  findUserByEmail,
  findUserById,
  createUser,
  getUserForResponse,
  getAllUsers,
};
