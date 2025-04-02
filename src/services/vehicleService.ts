import { query } from '../config/database';


export interface Vehicle {
  vehicle_id?: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string;
  color?: string;
  last_service_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllVehicles() {
  return query(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.customer_id
    ORDER BY v.make, v.model
  `);
}

// Obtener vehículo por ID
export async function getVehicleById(id: number) {
  const results = await query(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE v.vehicle_id = $1
  `, [id]);
  
  return results.length > 0 ? results[0] : null;
}

// Obtener vehículos por cliente
export async function getVehiclesByCustomer(customerId: number) {
  return query('SELECT * FROM vehicles WHERE customer_id = $1', [customerId]);
}

// Buscar vehículos
export async function searchVehicles(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE v.make LIKE $1 OR v.model LIKE $2 OR v.license_plate LIKE $3 
    OR v.vin LIKE $4 OR c.name LIKE $5
  `, [term, term, term, term, term]);
}

// Crear vehículo
export async function createVehicle(vehicle: Vehicle) {
  const vin = vehicle.vin === undefined ? null : vehicle.vin;
  const color = vehicle.color === undefined ? null : vehicle.color;
  const last_service_date = vehicle.last_service_date === undefined ? null : vehicle.last_service_date;
  
  const result = await query(
    'INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, color, last_service_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      vehicle.customer_id,
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.license_plate,
      vin,
      color,
      last_service_date
    ]
  );
  
  return result[0];
}

// Actualizar vehículo
export async function updateVehicle(id: number, vehicle: Partial<Vehicle>) {
  const fieldsToUpdate = Object.keys(vehicle)
    .filter(key => key !== 'vehicle_id' && key !== 'created_at')
    .map((key, index) => `${key} = $${index + 1}`);
  
  const valuesToUpdate = Object.keys(vehicle)
    .filter(key => key !== 'vehicle_id' && key !== 'created_at')
    .map(key => vehicle[key as keyof Vehicle]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE vehicles SET ${fieldsToUpdate.join(', ')} WHERE vehicle_id = $${valuesToUpdate.length + 1}`,
    [...valuesToUpdate, id]
  );
  
  return getVehicleById(id);
}

// Eliminar vehículo
export async function deleteVehicle(id: number) {
  return query('DELETE FROM vehicles WHERE vehicle_id = $1', [id]);
}
