// src/controllers/inventoryController.ts
import { Request, Response } from 'express';
import * as inventoryModel from '../models/inventoryModel';

// Get all inventory items
export async function getAllInventoryItems(req: Request, res: Response) {
  try {
    const items = await inventoryModel.getAllInventoryItems();
    res.json(items);
  } catch (error) {
    console.error('Error getting inventory items:', error);
    res.status(500).json({ error: 'Error getting inventory items' });
  }
}

// Get a single inventory item by ID
export async function getInventoryItemById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const item = await inventoryModel.getInventoryItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error getting inventory item:', error);
    res.status(500).json({ error: 'Error getting inventory item' });
  }
}

// Get items with low stock
export async function getLowStockItems(req: Request, res: Response) {
  try {
    const items = await inventoryModel.getLowStockItems();
    res.json(items);
  } catch (error) {
    console.error('Error getting low stock items:', error);
    res.status(500).json({ error: 'Error getting low stock items' });
  }
}

// Get items by category
export async function getItemsByCategory(req: Request, res: Response) {
  try {
    const category = req.params.category;
    const items = await inventoryModel.getItemsByCategory(category);
    res.json(items);
  } catch (error) {
    console.error('Error getting items by category:', error);
    res.status(500).json({ error: 'Error getting items by category' });
  }
}

// Search inventory items
export async function searchInventoryItems(req: Request, res: Response) {
  try {
    const term = req.params.term;
    const items = await inventoryModel.searchInventoryItems(term);
    res.json(items);
  } catch (error) {
    console.error('Error searching inventory items:', error);
    res.status(500).json({ error: 'Error searching inventory items' });
  }
}

// Create a new inventory item
export async function createInventoryItem(req: Request, res: Response) {
  try {
    // Validate required fields
    const { name, category, quantity, unit, cost_price, selling_price, reorder_level } = req.body;
    
    if (!name || !category || quantity === undefined || !unit || cost_price === undefined || selling_price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields (name, category, quantity, unit, cost_price, selling_price)' 
      });
    }
    
    // Prepare the item data
    const itemData: inventoryModel.InventoryItem = {
      name,
      description: req.body.description || null,
      category,
      quantity: Number(quantity),
      unit,
      cost_price: Number(cost_price),
      selling_price: Number(selling_price),
      reorder_level: Number(reorder_level || 5)  // Default reorder level if not provided
    };
    
    const newItem = await inventoryModel.createInventoryItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Error creating inventory item' });
  }
}

// Update an inventory item
export async function updateInventoryItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await inventoryModel.updateInventoryItem(id, req.body);
    
    if (result && 'error' in result) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Error updating inventory item' });
  }
}

// Adjust inventory quantity
export async function adjustInventoryQuantity(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { adjustment } = req.body;
    
    if (adjustment === undefined) {
      return res.status(400).json({ error: 'Adjustment value is required' });
    }
    
    const result = await inventoryModel.adjustInventoryQuantity(id, Number(adjustment));
    
    if (result && 'error' in result) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error adjusting inventory quantity:', error);
    res.status(500).json({ error: 'Error adjusting inventory quantity' });
  }
}

// Delete an inventory item
export async function deleteInventoryItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await inventoryModel.deleteInventoryItem(id);
    
    if ('error' in result) {
      return res.status(404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Error deleting inventory item' });
  }
}

// Record inventory usage
export async function recordInventoryUsage(req: Request, res: Response) {
  try {
    const { item_id, service_id, quantity, employee_id, notes } = req.body;
    
    if (!item_id || quantity === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields (item_id, quantity)' 
      });
    }
    
    const usageData: inventoryModel.InventoryUsage = {
      item_id: Number(item_id),
      service_id: service_id ? Number(service_id) : undefined,
      quantity: Number(quantity),
      employee_id: employee_id ? Number(employee_id) : undefined,
      usage_date: new Date(),
      notes
    };
    
    const result = await inventoryModel.recordInventoryUsage(usageData);
    
    if ('error' in result) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error recording inventory usage:', error);
    res.status(500).json({ error: 'Error recording inventory usage' });
  }
}

// Get usage history for an item
export async function getInventoryUsageHistory(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const history = await inventoryModel.getInventoryUsageHistory(id);
    res.json(history);
  } catch (error) {
    console.error('Error getting inventory usage history:', error);
    res.status(500).json({ error: 'Error getting inventory usage history' });
  }
}

// Get all inventory usage records
export async function getAllInventoryUsage(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const usage = await inventoryModel.getAllInventoryUsage(limit);
    res.json(usage);
  } catch (error) {
    console.error('Error getting inventory usage:', error);
    res.status(500).json({ error: 'Error getting inventory usage' });
  }
}

// Get all inventory categories
export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await inventoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error getting inventory categories:', error);
    res.status(500).json({ error: 'Error getting inventory categories' });
  }
}