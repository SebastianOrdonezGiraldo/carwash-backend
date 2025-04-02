import { query } from '../config/database';


export interface ServiceOffer {
  service_id?: number;
  name: string;
  description?: string;
  base_price: number;
  estimated_hours?: number;
  category_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllServices() {
  return query(`
    SELECT s.*, sc.name as category_name 
    FROM services s
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    ORDER BY s.name
  `);
}

// Obtener servicio por ID
export async function getServiceById(id: number) {
  const results = await query(`
    SELECT s.*, sc.name as category_name 
    FROM services s
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    WHERE s.service_id = $1
  `, [id]);
  
  return results.length > 0 ? results[0] : null;
}

// Obtener servicios por categoría
export async function getServicesByCategory(categoryId: number) {
  return query(`
    SELECT s.*, sc.name as category_name 
    FROM services s
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    WHERE s.category_id = $1
    ORDER BY s.name
  `, [categoryId]);
}

// Crear servicio
export async function createService(service: ServiceOffer) {
  const result = await query(
    'INSERT INTO services (name, description, base_price, estimated_hours, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [
      service.name,
      service.description,
      service.base_price,
      service.estimated_hours,
      service.category_id
    ]
  );
  
  return result[0];
}

// Actualizar servicio
export async function updateService(id: number, service: Partial<ServiceOffer>) {
  const fieldsToUpdate = Object.keys(service)
    .filter(key => key !== 'service_id' && key !== 'created_at')
    .map((key, index) => `${key} = $${index + 1}`);
  
  const valuesToUpdate = Object.keys(service)
    .filter(key => key !== 'service_id' && key !== 'created_at')
    .map(key => service[key as keyof ServiceOffer]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE services SET ${fieldsToUpdate.join(', ')} WHERE service_id = $${valuesToUpdate.length + 1}`,
    [...valuesToUpdate, id]
  );
  
  return getServiceById(id);
}

// Eliminar servicio
export async function deleteService(id: number) {
  return query('DELETE FROM services WHERE service_id = $1', [id]);
}

// Crear categoría de servicio
export async function createServiceCategory(name: string, description?: string) {
  const result = await query(
    'INSERT INTO service_categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  
  return result[0];
}