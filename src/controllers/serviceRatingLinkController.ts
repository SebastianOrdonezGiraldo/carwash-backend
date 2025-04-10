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

export async function validateServiceRatingLink(token: string): Promise<number | null> {
  try {
    console.log('Validando token en servicio:', token);
    
    const result = await query(
      `SELECT service_id FROM service_rating_links 
      WHERE unique_token = $1 
      AND is_used = false 
      AND expires_at > CURRENT_TIMESTAMP`,
      [token]
    );

    console.log('Resultado de consulta de token:', result);
    
    if (result.length === 0) {
      console.warn('No se encontró un token válido');
      // Verificar si el token existe pero está usado o expirado
      const existingToken = await query(
        `SELECT service_id, is_used, expires_at FROM service_rating_links 
        WHERE unique_token = $1`,
        [token]
      );

      if (existingToken.length > 0) {
        console.warn('Token existe pero está:', 
          existingToken[0].is_used ? 'usado' : 'expirado',
          'Expiración:', existingToken[0].expires_at
        );
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
