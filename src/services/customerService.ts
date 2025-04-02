import { query } from '../config/database';


export interface Customer {
  customer_id?: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllCustomers() {
  return query('SELECT * FROM customers ORDER BY name ASC');
}

// Obtener cliente por ID
export async function getCustomerById(id: number) {
  const results = await query('SELECT * FROM customers WHERE customer_id = $1', [id]);
  return results.length > 0 ? results[0] : null;
}

// Buscar clientes
export async function searchCustomers(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM customers WHERE name LIKE $1 OR email LIKE $2 OR phone LIKE $3',
    [term, term, term]
  );
}

// Crear cliente
export async function createCustomer(customer: Customer) {
  const email = customer.email === undefined ? null : customer.email;
  const address = customer.address === undefined ? null : customer.address;
  
  const result = await query(
    'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
    [customer.name, email, customer.phone, address]
  );
  
  return result[0];
}

// Actualizar cliente
export async function updateCustomer(id: number, customer: Partial<Customer>) {
  const fieldsToUpdate = Object.keys(customer)
    .filter(key => key !== 'customer_id' && key !== 'created_at')
    .map((key, index) => `${key} = $${index + 1}`);
  
  const valuesToUpdate = Object.keys(customer)
    .filter(key => key !== 'customer_id' && key !== 'created_at')
    .map(key => customer[key as keyof Customer]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE customers SET ${fieldsToUpdate.join(', ')} WHERE customer_id = $${valuesToUpdate.length + 1}`,
    [...valuesToUpdate, id]
  );
  
  return getCustomerById(id);
}

// Eliminar cliente
export async function deleteCustomer(id: number) {
  return query('DELETE FROM customers WHERE customer_id = $1', [id]);
}

// Obtener vehículos de cliente
export async function getCustomerWithVehicles(customerId: number) {
  const customer = await getCustomerById(customerId);
  if (!customer) return null;
  
  const vehicles = await query('SELECT * FROM vehicles WHERE customer_id = $1', [customerId]);
  return { ...customer, vehicles };
}
