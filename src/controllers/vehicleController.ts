import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';

export async function getAllVehicles(req: Request, res: Response) {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
}

export async function getVehicleById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const vehicle = await vehicleService.getVehicleById(id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }
    
    res.json(vehicle);
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({ error: 'Error al obtener vehículo' });
  }
}

export async function getVehiclesByCustomer(req: Request, res: Response) {
  try {
    const customerId = Number(req.params.customerId);
    const vehicles = await vehicleService.getVehiclesByCustomer(customerId);
    res.json(vehicles);
  } catch (error) {
    console.error('Error al obtener vehículos del cliente:', error);
    res.status(500).json({ error: 'Error al obtener vehículos del cliente' });
  }
}

export async function searchVehicles(req: Request, res: Response) {
  try {
    const term = req.params.term;
    const vehicles = await vehicleService.searchVehicles(term);
    res.json(vehicles);
  } catch (error) {
    console.error('Error al buscar vehículos:', error);
    res.status(500).json({ error: 'Error al buscar vehículos' });
  }
}

export async function createVehicle(req: Request, res: Response) {
  try {
    console.log('Datos recibidos para crear vehículo:', req.body);
    const newVehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(newVehicle);
  } catch (error: any) {
    console.error('Error detallado al crear vehículo:', error);
    
    // Devolver un mensaje de error más específico basado en el código de error SQL
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        error: 'El cliente especificado no existe', 
        details: error.message 
      });
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Ya existe un vehículo con esa placa o VIN', 
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error al crear vehículo', 
      details: error.message,
      code: error.code
    });
  }
}

export async function updateVehicle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedVehicle = await vehicleService.updateVehicle(id, req.body);
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    res.status(500).json({ error: 'Error al actualizar vehículo' });
  }
}

export async function deleteVehicle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await vehicleService.deleteVehicle(id);
    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
}
