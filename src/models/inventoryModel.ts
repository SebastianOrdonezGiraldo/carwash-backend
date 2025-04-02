// src/models/inventory.ts
import { query } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface InventoryItem {
  item_id?: number;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unit: string;
  cost_price: number;
  selling_price: number;
  reorder_level: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface InventoryCategory {
  category_id?: number;
  name: string;
  description?: string;
  created_at?: Date;
}

export interface InventoryUsage {
  usage_id?: number;
  item_id: number;
  service_id?: number;
  quantity: number;
  employee_id?: number;
  usage_date: Date;
  notes?: string;
  created_at?: Date;
}

// Get all inventory items
export async function getAllInventoryItems() {
  return query(`
    SELECT * FROM inventory
    ORDER BY name ASC
  `);
}

// Get a single inventory item by ID
export async function getInventoryItemById(id: number) {
  const results = await query(
    'SELECT * FROM inventory WHERE item_id = ?', 
    [id]
  ) as RowDataPacket[];
  
  return results.length > 0 ? results[0] : null;
}

// Get items with low stock
export async function getLowStockItems() {
  return query(`
    SELECT * FROM inventory
    WHERE quantity <= reorder_level
    ORDER BY (quantity / reorder_level) ASC
  `);
}

// Get items by category
export async function getItemsByCategory(category: string) {
  return query(
    'SELECT * FROM inventory WHERE category = ? ORDER BY name ASC',
    [category]
  );
}

// Search inventory items
export async function searchInventoryItems(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM inventory WHERE name LIKE ? OR description LIKE ? OR category LIKE ?',
    [term, term, term]
  );
}

// Create a new inventory item
export async function createInventoryItem(item: InventoryItem) {
  const result = await query(
    `INSERT INTO inventory (
      name, description, category, quantity, unit, 
      cost_price, selling_price, reorder_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.name,
      item.description,
      item.category,
      item.quantity,
      item.unit,
      item.cost_price,
      item.selling_price,
      item.reorder_level
    ]
  ) as ResultSetHeader;
  
  return getInventoryItemById(result.insertId);
}

// Update an inventory item
export async function updateInventoryItem(id: number, item: Partial<InventoryItem>) {
  const fields = [];
  const values = [];
  
  // Dynamically build update fields
  for (const [key, value] of Object.entries(item)) {
    if (key !== 'item_id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) {
    return { error: 'No fields to update' };
  }
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  await query(
    `UPDATE inventory SET ${fields.join(', ')} WHERE item_id = ?`,
    values
  );
  
  return getInventoryItemById(id);
}

// Adjust inventory quantity
export async function adjustInventoryQuantity(id: number, adjustment: number) {
  // First check if the adjustment would result in negative quantity
  const item = await getInventoryItemById(id) as InventoryItem;
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  const newQuantity = item.quantity + adjustment;
  
  if (newQuantity < 0) {
    return { error: 'Not enough stock available', current_stock: item.quantity };
  }
  
  await query(
    'UPDATE inventory SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE item_id = ?',
    [adjustment, id]
  );
  
  return getInventoryItemById(id);
}

// Delete an inventory item
export async function deleteInventoryItem(id: number) {
  // First check if the item exists
  const item = await getInventoryItemById(id);
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  await query('DELETE FROM inventory WHERE item_id = ?', [id]);
  
  return { message: 'Item deleted successfully' };
}

// Record inventory usage
export async function recordInventoryUsage(usage: InventoryUsage) {
  // First check if there's enough inventory
  const item = await getInventoryItemById(usage.item_id) as InventoryItem;
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  if (item.quantity < usage.quantity) {
    return { error: 'Not enough stock available', current_stock: item.quantity };
  }
  
  // Begin transaction
  await query('START TRANSACTION');
  
  try {
    // Reduce inventory quantity
    await query(
      'UPDATE inventory SET quantity = quantity - ?, updated_at = CURRENT_TIMESTAMP WHERE item_id = ?',
      [usage.quantity, usage.item_id]
    );
    
    // Record usage
    const result = await query(
      `INSERT INTO inventory_usage (
        item_id, service_id, quantity, employee_id, usage_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        usage.item_id,
        usage.service_id || null,
        usage.quantity,
        usage.employee_id || null,
        usage.usage_date,
        usage.notes || null
      ]
    ) as ResultSetHeader;
    
    await query('COMMIT');
    
    return {
      usage_id: result.insertId,
      ...usage
    };
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}

// Get usage history for an item
export async function getInventoryUsageHistory(itemId: number) {
  return query(`
    SELECT u.*, 
           i.name as item_name, 
           e.name as employee_name,
           s.name as service_name
    FROM inventory_usage u
    JOIN inventory i ON u.item_id = i.item_id
    LEFT JOIN employees e ON u.employee_id = e.employee_id
    LEFT JOIN services s ON u.service_id = s.service_id
    WHERE u.item_id = ?
    ORDER BY u.usage_date DESC
  `, [itemId]);
}

// Get all inventory usage records
export async function getAllInventoryUsage(limit = 100) {
  return query(`
    SELECT u.*, 
           i.name as item_name, 
           e.name as employee_name,
           s.name as service_name
    FROM inventory_usage u
    JOIN inventory i ON u.item_id = i.item_id
    LEFT JOIN employees e ON u.employee_id = e.employee_id
    LEFT JOIN services s ON u.service_id = s.service_id
    ORDER BY u.usage_date DESC
    LIMIT ?
  `, [limit]);
}

// Get all inventory categories
export async function getAllCategories() {
  return query(`
    SELECT DISTINCT category FROM inventory ORDER BY category
  `);
}