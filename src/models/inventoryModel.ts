// src/models/inventory.ts
import { query } from '../config/database';


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

// Obtener un item de inventario por ID
export async function getInventoryItemById(id: number) {
  const results = await query(
    'SELECT * FROM inventory WHERE item_id = $1', 
    [id]
  );
  
  return results.length > 0 ? results[0] : null;
}

// Obtener items por categoría
export async function getItemsByCategory(category: string) {
  return query(
    'SELECT * FROM inventory WHERE category = $1 ORDER BY name ASC',
    [category]
  );
}

// Buscar items de inventario
export async function searchInventoryItems(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM inventory WHERE name LIKE $1 OR description LIKE $2 OR category LIKE $3',
    [term, term, term]
  );
}

// Crear un nuevo item de inventario
export async function createInventoryItem(item: InventoryItem) {
  const result = await query(
    `INSERT INTO inventory (
      name, description, category, quantity, unit, 
      cost_price, selling_price, reorder_level
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
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
  );
  
  return result.length > 0 ? result[0] : null;
}

// Actualizar un item de inventario
export async function updateInventoryItem(id: number, item: Partial<InventoryItem>) {
  const fields = [];
  const values = [];
  let paramIndex = 1;
  
  // Dynamically build update fields
  for (const [key, value] of Object.entries(item)) {
    if (key !== 'item_id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
  }
  
  if (fields.length === 0) {
    return { error: 'No fields to update' };
  }
  
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);
  
  await query(
    `UPDATE inventory SET ${fields.join(', ')} WHERE item_id = $${paramIndex}`,
    values
  );
  
  return getInventoryItemById(id);
}

// Ajustar cantidad de inventario
export async function adjustInventoryQuantity(id: number, adjustment: number) {
  // First check if the adjustment would result in negative quantity
  const item = await getInventoryItemById(id);
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  const newQuantity = item.quantity + adjustment;
  
  if (newQuantity < 0) {
    return { error: 'Not enough stock available', current_stock: item.quantity };
  }
  
  await query(
    'UPDATE inventory SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE item_id = $2',
    [adjustment, id]
  );
  
  return getInventoryItemById(id);
}

// Eliminar un item de inventario
export async function deleteInventoryItem(id: number) {
  // First check if the item exists
  const item = await getInventoryItemById(id);
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  await query('DELETE FROM inventory WHERE item_id = $1', [id]);
  
  return { message: 'Item deleted successfully' };
}

// Registrar uso de inventario
export async function recordInventoryUsage(usage: InventoryUsage) {
  // First check if there's enough inventory
  const item = await getInventoryItemById(usage.item_id);
  
  if (!item) {
    return { error: 'Item not found' };
  }
  
  if (item.quantity < usage.quantity) {
    return { error: 'Not enough stock available', current_stock: item.quantity };
  }
  
  // Begin transaction - note: in PostgreSQL we'll need to adapt this
  await query('BEGIN');
  
  try {
    // Reduce inventory quantity
    await query(
      'UPDATE inventory SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE item_id = $2',
      [usage.quantity, usage.item_id]
    );
    
    // Record usage
    const result = await query(
      `INSERT INTO inventory_usage (
        item_id, service_id, quantity, employee_id, usage_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        usage.item_id,
        usage.service_id || null,
        usage.quantity,
        usage.employee_id || null,
        usage.usage_date,
        usage.notes || null
      ]
    );
    
    await query('COMMIT');
    
    return result[0];
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}

// Obtener historial de uso para un item
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
    WHERE u.item_id = $1
    ORDER BY u.usage_date DESC
  `, [itemId]);
}