import { query } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Employee {
  employee_id?: number;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  hire_date: Date | string;
  status: 'active' | 'inactive';
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllEmployees() {
  return query('SELECT * FROM employees ORDER BY name');
}

export async function getActiveEmployees() {
  return query('SELECT * FROM employees WHERE status = "active" ORDER BY name');
}

export async function getEmployeeById(id: number) {
  const results = await query('SELECT * FROM employees WHERE employee_id = ?', [id]) as RowDataPacket[];
  return results.length > 0 ? results[0] : null;
}

export async function searchEmployees(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM employees WHERE name LIKE ? OR position LIKE ? OR email LIKE ? OR phone LIKE ?',
    [term, term, term, term]
  );
}

export async function createEmployee(employee: Employee) {
  // Convertir valores undefined a null para la base de datos
  const email = employee.email === undefined ? null : employee.email;
  const phone = employee.phone === undefined ? null : employee.phone;
  
  const result = await query(
    'INSERT INTO employees (name, position, email, phone, hire_date, status) VALUES (?, ?, ?, ?, ?, ?)',
    [
      employee.name,
      employee.position,
      email,
      phone,
      employee.hire_date,
      employee.status
    ]
  ) as ResultSetHeader;
  
  return { ...employee, employee_id: result.insertId };
}

export async function updateEmployee(id: number, employee: Partial<Employee>) {
  const fieldsToUpdate = Object.keys(employee)
    .filter(key => key !== 'employee_id' && key !== 'created_at')
    .map(key => `${key} = ?`);
  
  const valuesToUpdate = Object.keys(employee)
    .filter(key => key !== 'employee_id' && key !== 'created_at')
    .map(key => {
      const value = employee[key as keyof Employee];
      return value === undefined ? null : value;
    });

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE employees SET ${fieldsToUpdate.join(', ')} WHERE employee_id = ?`,
    [...valuesToUpdate, id]
  );
  
  return getEmployeeById(id);
}

export async function deleteEmployee(id: number) {
  return query('DELETE FROM employees WHERE employee_id = ?', [id]);
}

export async function changeEmployeeStatus(id: number, status: 'active' | 'inactive') {
  await query(
    'UPDATE employees SET status = ? WHERE employee_id = ?',
    [status, id]
  );
  
  return getEmployeeById(id);
}