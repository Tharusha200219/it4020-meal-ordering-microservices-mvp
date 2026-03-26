const { 
  createMenu, 
  getAllMenus, 
  findById, 
  findByRestaurantId,
  updateMenu,      // ← new
  deleteMenu       // ← new
} = require('../models/data');

const createMenuItem = (req, res) => {
  try {
    const menu = createMenu(req.body);
    res.status(201).json({ message: 'Menu item created successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item' });
  }
};

const getMenus = (req, res) => {
  const { restaurant_id } = req.query;
  let result = getAllMenus();
  if (restaurant_id) result = findByRestaurantId(restaurant_id);
  res.json(result);
};

const getMenuById = (req, res) => {
  const menu = findById(req.params.id);
  if (!menu) return res.status(404).json({ message: 'Menu not found' });
  res.json(menu);
};

// NEW: Update menu
const updateMenuItem = (req, res) => {
  const updated = updateMenu(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Menu not found' });
  res.json({ message: 'Menu updated successfully', menu: updated });
};

// NEW: Delete menu
const deleteMenuItem = (req, res) => {
  const success = deleteMenu(req.params.id);
  if (!success) return res.status(404).json({ message: 'Menu not found' });
  res.json({ message: 'Menu deleted successfully' });
};

module.exports = {
  createMenuItem,
  getMenus,
  getMenuById,
  updateMenuItem,    // ← new
  deleteMenuItem     // ← new
};