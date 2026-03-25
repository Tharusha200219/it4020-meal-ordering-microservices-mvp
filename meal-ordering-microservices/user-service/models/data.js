// In-memory users storage
let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin",
    phone: "1234567890",
    address: "System Admin Address",
    role: "admin",
  }
];
let userIdCounter = 2;

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
    role: "user",
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

// Update user by id
const updateUser = (id, updateData) => {
  const user = findUserById(id);
  if (user) {
    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.password !== undefined) user.password = updateData.password;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.address !== undefined) user.address = updateData.address;
  }
  return user;
};

// Delete user by id
const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  users,
  findUserByEmail,
  findUserById,
  createUser,
  getUserForResponse,
  getAllUsers,
  updateUser,
  deleteUser,
};
