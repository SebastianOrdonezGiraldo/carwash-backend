// src/controllers/serviceRatingLinkController.ts
import { Request, Response } from 'express';
import * as ServiceRatingLinkService from '../services/serviceRatingLinkService';
import * as PendingServiceModel from '../models/pendingService';

// src/controllers/serviceRatingLinkController.ts
export async function generateRatingLink(req: Request, res: Response) {
  try {
    const serviceId = Number(req.params.serviceId);

    // Verificar que el servicio existe y está completado
    const service = await PendingServiceModel.getPendingServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    if (service.status !== 'completed') {
      return res.status(400).json({ error: 'Solo se pueden generar enlaces para servicios completados' });
    }

    // Generar enlace de calificación
    const uniqueToken = await ServiceRatingLinkService.createServiceRatingLink(serviceId);

    // Construir URL de calificación usando el token, no el serviceId
    const frontendUrl = process.env.FRONTEND_URL || 'https://vehicle-spruce-frontend.onrender.com';
    const ratingUrl = `${frontendUrl}/rate-service/${uniqueToken}`;

    res.json({ 
      token: uniqueToken, 
      ratingUrl 
    });
  } catch (error) {
    console.error('Error al generar enlace de calificación:', error);
    res.status(500).json({ error: 'Error al generar enlace de calificación' });
  }
}

export async function validateRatingLink(req: Request, res: Response) {
  try {
    const { token } = req.params;
    // Validar token y obtener service_id
    const serviceId = await ServiceRatingLinkService.validateServiceRatingLink(token);
    if (!serviceId) {
      return res.status(404).json({ error: 'Enlace de calificación inválido o expirado' });
    }
    // Obtener detalles del servicio
    const service = await PendingServiceModel.getPendingServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    // Devolver detalles básicos del servicio
    res.json({
      serviceId: service.service_id,
      vehicleMake: service.make,
      vehicleModel: service.model,
      licensePlate: service.license_plate
    });
  } catch (error) {
    console.error('Error al validar enlace de calificación:', error);
    res.status(500).json({ error: 'Error al validar enlace de calificación' });
  }
}

    return result.length > 0 ? result[0].service_id : null;
  } catch (error) {
    console.error('Error completo en validación de token:', error);
    
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    return null;
  }
}
