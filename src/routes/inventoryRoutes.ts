// src/routes/inventoryRoutes.ts
import express from 'express';
import * as inventoryController from '../controllers/inventoryController';

const router = express.Router();

// Get all inventory items
router.get('/', inventoryController.getAllInventoryItems);

// Get low stock items
router.get('/low-stock', inventoryController.getLowStockItems);

// Get items by category
router.get('/category/:category', inventoryController.getItemsByCategory);

// Search inventory items
router.get('/search/:term', inventoryController.searchInventoryItems);

// Get all inventory categories
router.get('/categories', inventoryController.getAllCategories);

// Get all inventory usage records
router.get('/usage', inventoryController.getAllInventoryUsage);

// Get usage history for an item
router.get('/:id/usage', inventoryController.getInventoryUsageHistory);

// Get a single inventory item by ID
router.get('/:id', inventoryController.getInventoryItemById);

// Create a new inventory item
router.post('/', inventoryController.createInventoryItem);

// Record inventory usage
router.post('/usage', inventoryController.recordInventoryUsage);

// Update an inventory item
router.put('/:id', inventoryController.updateInventoryItem);

// Adjust inventory quantity
router.patch('/:id/quantity', inventoryController.adjustInventoryQuantity);

// Delete an inventory item
router.delete('/:id', inventoryController.deleteInventoryItem);

export default router;