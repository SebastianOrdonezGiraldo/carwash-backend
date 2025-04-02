import { query } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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

export async function getVehicleById(id: number) {
  const results = await query(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE v.vehicle_id = ?
  `, [id]) as RowDataPacket[];
  
  return results.length > 0 ? results[0] : null;
}

export async function getVehiclesByCustomer(customerId: number) {
  return query('SELECT * FROM vehicles WHERE customer_id = ?', [customerId]);
}

export async function searchVehicles(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(`
    SELECT v.*, c.name as customer_name 
    FROM vehicles v
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE v.make LIKE ? OR v.model LIKE ? OR v.license_plate LIKE ? 
    OR v.vin LIKE ? OR c.name LIKE ?
  `, [term, term, term, term, term]);
}

export async function createVehicle(vehicle: Vehicle) {
  // Convertir valores undefined a null para la base de datos
  const vin = vehicle.vin === undefined ? null : vehicle.vin;
  const color = vehicle.color === undefined ? null : vehicle.color;
  const last_service_date = vehicle.last_service_date === undefined ? null : vehicle.last_service_date;
  
  const result = await query(
    'INSERT INTO vehicles (customer_id, make, model, year, license_plate, vin, color, last_service_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      vehicle.customer_id,
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.license_plate,
      vin,          // Usamos null en lugar de undefined
      color,        // Usamos null en lugar de undefined
      last_service_date  // Usamos null en lugar de undefined
    ]
  ) as ResultSetHeader;
  
  return { ...vehicle, vehicle_id: result.insertId };
}

export async function updateVehicle(id: number, vehicle: Partial<Vehicle>) {
  const fieldsToUpdate = Object.keys(vehicle)
    .filter(key => key !== 'vehicle_id' && key !== 'created_at')
    .map(key => `${key} = ?`);
  
  const valuesToUpdate = Object.keys(vehicle)
    .filter(key => key !== 'vehicle_id' && key !== 'created_at')
    .map(key => vehicle[key as keyof Vehicle]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE vehicles SET ${fieldsToUpdate.join(', ')} WHERE vehicle_id = ?`,
    [...valuesToUpdate, id]
  );
  
  return getVehicleById(id);
}

export async function deleteVehicle(id: number) {
  return query('DELETE FROM vehicles WHERE vehicle_id = ?', [id]);
}
