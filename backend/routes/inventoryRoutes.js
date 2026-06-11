import express from 'express';
import {
  getInventory,
  getAvailableInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get in-stock items for pizza builder
router.get('/available', getAvailableInventory);

// Admin routes
router.route('/')
  .get(protect, admin, getInventory)
  .post(protect, admin, createInventoryItem);

router.route('/:id')
  .put(protect, admin, updateInventoryItem)
  .delete(protect, admin, deleteInventoryItem);

export default router;
