// src/controllers/pendingServiceController.ts
import { Request, Response } from 'express';
import * as pendingServiceModel from '../models/pendingService';
import * as ServiceRatingLinkService from '../services/serviceRatingLinkService';



export async function getAllPendingServices(req: Request, res: Response) {
  try {
    const services = await pendingServiceModel.getAllPendingServices();
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios pendientes:', error);
    res.status(500).json({ error: 'Error al obtener servicios pendientes' });
  }
}

export async function getPendingServiceById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const service = await pendingServiceModel.getPendingServiceById(id);
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error al obtener servicio pendiente:', error);
    res.status(500).json({ error: 'Error al obtener servicio pendiente' });
  }
}

export async function getServicesByStatus(req: Request, res: Response) {
  try {
    const status = req.params.status;
    
    // Validamos que el estado sea uno de los permitidos
    if (!['pending', 'in-progress', 'completed', 'delayed'].includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    
    const services = await pendingServiceModel.getServicesByStatus(status);
    res.json(services);
  } catch (error) {
    console.error('Error al obtener servicios por estado:', error);
    res.status(500).json({ error: 'Error al obtener servicios por estado' });
  }
}

export async function createPendingService(req: Request, res: Response) {
  try {
    // Extraemos y validamos los datos necesarios
    const {
      vehicle_id,
      service_type_id,
      employee_id,
      entry_time,
      estimated_completion_time,
      notes
    } = req.body;
    
    if (!vehicle_id || !service_type_id) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (vehicle_id, service_type_id)'
      });
    }
    
    // Preparamos el objeto de servicio
    const newService = {
      vehicle_id,
      service_type_id,
      employee_id: employee_id || null,
      entry_time: entry_time ? new Date(entry_time) : new Date(),
      estimated_completion_time: estimated_completion_time ? 
        new Date(estimated_completion_time) : new Date(Date.now() + 60 * 60 * 1000), // 1 hora por defecto
      status: employee_id ? 'in-progress' : 'pending',
      notes
    } as pendingServiceModel.PendingService;
    
    const result = await pendingServiceModel.createPendingService(newService);
    
    if (!result) {
      return res.status(500).json({ error: 'Error al crear servicio pendiente' });
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear servicio pendiente:', error);
    res.status(500).json({ error: 'Error al crear servicio pendiente' });
  }
}

// En el archivo src/controllers/pendingServiceController.ts
export async function updatePendingService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updateData = req.body;
    
    // Validar datos según sea necesario
    if (updateData.status && 
        !['pending', 'in-progress', 'completed', 'delayed'].includes(updateData.status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    
    const result = await pendingServiceModel.updatePendingService(id, updateData);
    
    // Verificar si result es null o undefined primero
    if (!result) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    // Ahora es seguro verificar si contiene 'error'
    if ('error' in result) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error al actualizar servicio pendiente:', error);
    res.status(500).json({ error: 'Error al actualizar servicio pendiente' });
  }
}

export async function assignServiceToEmployee(req: Request, res: Response) {
  try {
    const serviceId = Number(req.params.id);
    const { employee_id } = req.body;
    
    if (!employee_id) {
      return res.status(400).json({ error: 'ID de empleado requerido' });
    }
    
    const result = await pendingServiceModel.assignServiceToEmployee(serviceId, employee_id);
    
    if (!result) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error al asignar servicio a empleado:', error);
    res.status(500).json({ error: 'Error al asignar servicio a empleado' });
  }
}

// Removed duplicate implementation of markServiceAsComplete

export async function deletePendingService(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await pendingServiceModel.deletePendingService(id);
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio pendiente:', error);
    res.status(500).json({ error: 'Error al eliminar servicio pendiente' });
  }
}

export async function searchPendingServices(req: Request, res: Response) {
  try {
    const searchTerm = req.params.term;
    const services = await pendingServiceModel.searchPendingServices(searchTerm);
    res.json(services);
  } catch (error) {
    console.error('Error al buscar servicios pendientes:', error);
    res.status(500).json({ error: 'Error al buscar servicios pendientes' });
  }
}

export async function markServiceAsComplete(req: Request, res: Response) {
  try {
    const serviceId = Number(req.params.id);
    
    // Marcar servicio como completado
    const updatedService = await pendingServiceModel.markServiceAsComplete(serviceId);
    
    if (!updatedService) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Generar enlace de calificación
    const ratingLink = await ServiceRatingLinkService.createServiceRatingLink(serviceId);
    
    // Construir URL de calificación 
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const ratingUrl = `${frontendUrl}/rate-service/${ratingLink}`;

    res.json({
      service: updatedService,
      ratingLink,
      ratingUrl
    });
  } catch (error) {
    console.error('Error al marcar servicio como completado:', error);
    res.status(500).json({ error: 'Error al marcar servicio como completado' });
  }
}