import { Request, Response } from 'express';
import * as customerService from '../services/customerService';

export async function getAllCustomers(req: Request, res: Response) {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.getCustomerById(id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
}

export async function searchCustomers(req: Request, res: Response) {
  try {
    const term = req.params.term;
    const customers = await customerService.searchCustomers(term);
    res.json(customers);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
}

export async function createCustomer(req: Request, res: Response) {
  try {
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedCustomer = await customerService.updateCustomer(id, req.body);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await customerService.deleteCustomer(id);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
}

export async function getCustomerWithVehicles(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const customerWithVehicles = await customerService.getCustomerWithVehicles(id);
    
    if (!customerWithVehicles) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json(customerWithVehicles);
  } catch (error) {
    console.error('Error al obtener cliente con vehículos:', error);
    res.status(500).json({ error: 'Error al obtener cliente con vehículos' });
  }
}
