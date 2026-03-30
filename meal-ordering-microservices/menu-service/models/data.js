let menus = [];
let idCounter = 1;

const getAllMenus = () => menus;
const findById = (id) => menus.find(m => m.id === parseInt(id));
const findByRestaurantId = (restaurantId) => 
  menus.filter(m => m.restaurant_id === parseInt(restaurantId));

const createMenu = (menuData) => {
  const newMenu = {
    id: idCounter++,
    restaurant_id: parseInt(menuData.restaurant_id),
    name: menuData.name,
    description: menuData.description,
    price: parseFloat(menuData.price)
  };
  menus.push(newMenu);
  return newMenu;
};

// NEW: Update menu
const updateMenu = (id, menuData) => {
  const menu = findById(id);
  if (!menu) return null;
  
  menu.restaurant_id = parseInt(menuData.restaurant_id) || menu.restaurant_id;
  menu.name = menuData.name || menu.name;
  menu.description = menuData.description || menu.description;
  menu.price = parseFloat(menuData.price) || menu.price;
  return menu;
};

// NEW: Delete menu
const deleteMenu = (id) => {
  const index = menus.findIndex(m => m.id === parseInt(id));
  if (index === -1) return false;
  menus.splice(index, 1);
  return true;
};

module.exports = {
  getAllMenus,
  findById,
  findByRestaurantId,
  createMenu,
  updateMenu,      // ← new
  deleteMenu       // ← new
};