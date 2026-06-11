import Inventory from '../models/Inventory.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({}).sort({ type: 1, name: 1 });
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available inventory items (quantity > 0)
// @route   GET /api/inventory/available
// @access  Public
export const getAvailableInventory = async (req, res, next) => {
  try {
    const available = await Inventory.find({ quantity: { $gt: 0 } }).sort({ type: 1, name: 1 });
    res.status(200).json({ success: true, count: available.length, data: available });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private/Admin
export const createInventoryItem = async (req, res, next) => {
  const { name, type, quantity, threshold, price } = req.body;

  try {
    const itemExists = await Inventory.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

    if (itemExists) {
      return res.status(400).json({ success: false, message: 'Inventory item with this name already exists' });
    }

    const item = await Inventory.create({
      name: name.trim(),
      type,
      quantity,
      threshold,
      price,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
export const updateInventoryItem = async (req, res, next) => {
  const { name, type, quantity, threshold, price } = req.body;

  try {
    const updates = {};
    if (name) updates.name = name.trim();
    if (type) updates.type = type;
    if (quantity !== undefined) updates.quantity = quantity;
    if (threshold !== undefined) updates.threshold = threshold;
    if (price !== undefined) updates.price = price;

    const item = await Inventory.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
export const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    next(error);
  }
};
