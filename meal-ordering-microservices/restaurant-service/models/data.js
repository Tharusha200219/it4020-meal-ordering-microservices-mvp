let restaurants = [];
let idCounter = 1;

const getAll = () => restaurants;

const getById = (id) => restaurants.find(r => r.id === parseInt(id));

const create = (restaurantData) => {
    const restaurant = {
        id: idCounter++,
        ...restaurantData
    };
    restaurants.push(restaurant);
    return restaurant;
};

// ✅ UPDATE
const update = (id, updatedData) => {
    const index = restaurants.findIndex(r => r.id === parseInt(id));
    if (index === -1) return null;

    restaurants[index] = {
        ...restaurants[index],
        ...updatedData
    };

    return restaurants[index];
};

// ❌ DELETE
const remove = (id) => {
    const index = restaurants.findIndex(r => r.id === parseInt(id));
    if (index === -1) return null;

    const deleted = restaurants.splice(index, 1);
    return deleted[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};