const { getAll, getById, create, update, remove } = require('../models/data');

const createRestaurant = (req, res) => {
    try {
        const { name, location, cuisine } = req.body;

        if (!name || !location || !cuisine) {
            return res.status(400).json({ message: 'Name, location, and cuisine are required' });
        }

        const restaurant = create({ name, location, cuisine });
        res.status(201).json(restaurant);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllRestaurants = (req, res) => {
    try {
        const restaurants = getAll();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getRestaurantById = (req, res) => {
    try {
        const restaurant = getById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ UPDATE
const updateRestaurant = (req, res) => {
    try {
        const { name, location, cuisine } = req.body;

        const updated = update(req.params.id, { name, location, cuisine });

        if (!updated) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ❌ DELETE
const deleteRestaurant = (req, res) => {
    try {
        const deleted = remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};