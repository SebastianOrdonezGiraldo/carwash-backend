import { Request, Response } from 'express';
import * as serviceService from '../services/serviceOffersService';

export async function getAllServices(req: Request, res: Response) {
  try {
    const services = await serviceService.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const service = await serviceService.getServiceById(id);
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
}

export async function getServicesByCategory(req: Request, res: Response) {
  try {
    const categoryId = Number(req.params.categoryId);
    const services = await serviceService.getServicesByCategory(categoryId);
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios por categoría:', error);
    res.status(500).json({ error: 'Error al obtener servicios por categoría' });
  }
}

export async function getAllServiceCategories(req: Request, res: Response) {
  try {
    const categories = await serviceService.getAllServiceCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías de servicios:', error);
    res.status(500).json({ error: 'Error al obtener categorías de servicios' });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const newService = await serviceService.createService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedService = await serviceService.updateService(id, req.body);
    res.json(updatedService);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await serviceService.deleteService(id);
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
}

export async function createServiceCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body;
    const newCategory = await serviceService.createServiceCategory(name, description);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error al crear categoría de servicio:', error);
    res.status(500).json({ error: 'Error al crear categoría de servicio' });
  }
}
