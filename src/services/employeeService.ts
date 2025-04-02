import { query } from '../config/database';


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

// Obtener empleado por ID
export async function getEmployeeById(id: number) {
  const results = await query('SELECT * FROM employees WHERE employee_id = $1', [id]);
  return results.length > 0 ? results[0] : null;
}

// Buscar empleados
export async function searchEmployees(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM employees WHERE name LIKE $1 OR position LIKE $2 OR email LIKE $3 OR phone LIKE $4',
    [term, term, term, term]
  );
}

// Crear empleado
export async function createEmployee(employee: Employee) {
  const email = employee.email === undefined ? null : employee.email;
  const phone = employee.phone === undefined ? null : employee.phone;
  
  const result = await query(
    'INSERT INTO employees (name, position, email, phone, hire_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      employee.name,
      employee.position,
      email,
      phone,
      employee.hire_date,
      employee.status
    ]
  );
  
  return result[0];
}

// Actualizar empleado
export async function updateEmployee(id: number, employee: Partial<Employee>) {
  const fieldsToUpdate = Object.keys(employee)
    .filter(key => key !== 'employee_id' && key !== 'created_at')
    .map((key, index) => `${key} = $${index + 1}`);
  
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
    `UPDATE employees SET ${fieldsToUpdate.join(', ')} WHERE employee_id = $${valuesToUpdate.length + 1}`,
    [...valuesToUpdate, id]
  );
  
  return getEmployeeById(id);
}

// Eliminar empleado
export async function deleteEmployee(id: number) {
  return query('DELETE FROM employees WHERE employee_id = $1', [id]);
}

// Cambiar estado del empleado
export async function changeEmployeeStatus(id: number, status: 'active' | 'inactive') {
  await query(
    'UPDATE employees SET status = $1 WHERE employee_id = $2',
    [status, id]
  );
  
  return getEmployeeById(id);
}