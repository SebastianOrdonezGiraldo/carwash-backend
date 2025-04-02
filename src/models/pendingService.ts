// src/models/pendingService.ts
import { query } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface PendingService {
  service_id?: number;
  vehicle_id: number;
  service_type_id: number;
  employee_id?: number;
  client_name: string;
  license_plate: string;
  vehicle_type: string;
  entry_time: Date;
  estimated_completion_time: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllPendingServices() {
  return query(`
    SELECT 
      ps.*,
      v.make, 
      v.model, 
      v.license_plate,
      v.year,
      v.color,
      c.name as client_name,
      c.phone as client_phone,
      s.name as service_type_name,
      s.base_price as service_price,
      s.estimated_hours as service_hours,
      e.name as employee_name,
      e.position as employee_position
    FROM 
      pending_services ps
    JOIN 
      vehicles v ON ps.vehicle_id = v.vehicle_id
    JOIN 
      customers c ON v.customer_id = c.customer_id
    JOIN 
      services s ON ps.service_type_id = s.service_id
    LEFT JOIN 
      employees e ON ps.employee_id = e.employee_id
    ORDER BY 
      ps.entry_time DESC
  `);
}

export async function getPendingServiceById(id: number) {
  const results = await query(`
    SELECT 
      ps.*,
      v.make, 
      v.model, 
      v.license_plate,
      v.year,
      v.color,
      c.name as client_name,
      c.phone as client_phone,
      s.name as service_type_name,
      s.base_price as service_price,
      s.estimated_hours as service_hours,
      e.name as employee_name,
      e.position as employee_position
    FROM 
      pending_services ps
    JOIN 
      vehicles v ON ps.vehicle_id = v.vehicle_id
    JOIN 
      customers c ON v.customer_id = c.customer_id
    JOIN 
      services s ON ps.service_type_id = s.service_id
    LEFT JOIN 
      employees e ON ps.employee_id = e.employee_id
    WHERE 
      ps.service_id = ?
  `, [id]) as RowDataPacket[];
  
  return results.length > 0 ? results[0] : null;
}

export async function getServicesByStatus(status: string) {
  return query(`
    SELECT 
      ps.*,
      v.make, 
      v.model, 
      v.license_plate,
      v.year,
      v.color,
      c.name as client_name,
      c.phone as client_phone,
      s.name as service_type_name,
      s.base_price as service_price,
      s.estimated_hours as service_hours,
      e.name as employee_name,
      e.position as employee_position
    FROM 
      pending_services ps
    JOIN 
      vehicles v ON ps.vehicle_id = v.vehicle_id
    JOIN 
      customers c ON v.customer_id = c.customer_id
    JOIN 
      services s ON ps.service_type_id = s.service_id
    LEFT JOIN 
      employees e ON ps.employee_id = e.employee_id
    WHERE 
      ps.status = ?
    ORDER BY 
      ps.entry_time DESC
  `, [status]);
}

export async function createPendingService(service: PendingService) {
  const result = await query(`
    INSERT INTO pending_services (
      vehicle_id, 
      service_type_id, 
      employee_id, 
      entry_time, 
      estimated_completion_time, 
      status, 
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    service.vehicle_id,
    service.service_type_id,
    service.employee_id || null,
    service.entry_time,
    service.estimated_completion_time,
    service.status,
    service.notes || null
  ]) as ResultSetHeader;
  
  if (result.insertId) {
    return getPendingServiceById(result.insertId);
  }
  return null;
}

export async function updatePendingService(id: number, service: Partial<PendingService>) {
  const fields = [];
  const values = [];
  
  // Construir dinámicamente los campos a actualizar
  if (service.vehicle_id !== undefined) {
    fields.push('vehicle_id = ?');
    values.push(service.vehicle_id);
  }
  
  if (service.service_type_id !== undefined) {
    fields.push('service_type_id = ?');
    values.push(service.service_type_id);
  }
  
  if (service.employee_id !== undefined) {
    fields.push('employee_id = ?');
    values.push(service.employee_id);
  }
  
  if (service.entry_time !== undefined) {
    fields.push('entry_time = ?');
    values.push(service.entry_time);
  }
  
  if (service.estimated_completion_time !== undefined) {
    fields.push('estimated_completion_time = ?');
    values.push(service.estimated_completion_time);
  }
  
  if (service.status !== undefined) {
    fields.push('status = ?');
    values.push(service.status);
  }
  
  if (service.notes !== undefined) {
    fields.push('notes = ?');
    values.push(service.notes);
  }
  
  if (fields.length === 0) {
    return { error: 'No fields to update' };
  }
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  
  // Agregar ID al final de values para el WHERE
  values.push(id);
  
  await query(
    `UPDATE pending_services SET ${fields.join(', ')} WHERE service_id = ?`,
    values
  );
  
  return getPendingServiceById(id);
}

export async function assignServiceToEmployee(serviceId: number, employeeId: number) {
  await query(`
    UPDATE pending_services 
    SET 
      employee_id = ?,
      status = 'in-progress',
      updated_at = CURRENT_TIMESTAMP
    WHERE 
      service_id = ?
  `, [employeeId, serviceId]);
  
  return getPendingServiceById(serviceId);
}

export async function markServiceAsComplete(serviceId: number) {
  await query(`
    UPDATE pending_services 
    SET 
      status = 'completed',
      updated_at = CURRENT_TIMESTAMP
    WHERE 
      service_id = ?
  `, [serviceId]);
  
  return getPendingServiceById(serviceId);
}

export async function deletePendingService(serviceId: number) {
  return query('DELETE FROM pending_services WHERE service_id = ?', [serviceId]);
}

// Función para obtener los servicios con búsqueda
export async function searchPendingServices(searchTerm: string) {
  const term = `%${searchTerm}%`;
  
  return query(`
    SELECT 
      ps.*,
      v.make, 
      v.model, 
      v.license_plate,
      v.year,
      v.color,
      c.name as client_name,
      c.phone as client_phone,
      s.name as service_type_name,
      s.base_price as service_price,
      s.estimated_hours as service_hours,
      e.name as employee_name,
      e.position as employee_position
    FROM 
      pending_services ps
    JOIN 
      vehicles v ON ps.vehicle_id = v.vehicle_id
    JOIN 
      customers c ON v.customer_id = c.customer_id
    JOIN 
      services s ON ps.service_type_id = s.service_id
    LEFT JOIN 
      employees e ON ps.employee_id = e.employee_id
    WHERE 
      v.license_plate LIKE ? OR
      c.name LIKE ? OR
      s.name LIKE ?
    ORDER BY 
      ps.entry_time DESC
  `, [term, term, term]);
}