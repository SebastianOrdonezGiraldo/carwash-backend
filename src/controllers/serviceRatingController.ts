// src/controllers/serviceRatingController.ts
import { Request, Response } from 'express';
import * as ServiceRatingModel from '../models/serviceRatingModel';

export async function rateService(req: Request, res: Response) {
  try {
    const serviceId = Number(req.params.serviceId);
    const { 
      wait_time_rating, 
      staff_friendliness_rating, 
      service_quality_rating,
      customer_comment 
    } = req.body;

    // Validar que el servicio esté completado
    const isCompleted = await ServiceRatingModel.checkServiceCompletedStatus(serviceId);
    if (!isCompleted) {
      return res.status(400).json({ error: 'Solo se pueden calificar servicios completados' });
    }

    // Validar ratings
    if (
      !wait_time_rating || wait_time_rating < 1 || wait_time_rating > 5 ||
      !staff_friendliness_rating || staff_friendliness_rating < 1 || staff_friendliness_rating > 5 ||
      !service_quality_rating || service_quality_rating < 1 || service_quality_rating > 5
    ) {
      return res.status(400).json({ error: 'Calificaciones deben estar entre 1 y 5' });
    }

    const ratingData = {
      service_id: serviceId,
      wait_time_rating,
      staff_friendliness_rating,
      service_quality_rating,
      customer_comment
    };

    const rating = await ServiceRatingModel.createServiceRating(ratingData);
    res.status(201).json(rating);
  } catch (error) {
    console.error('Error al calificar servicio:', error);
    res.status(500).json({ error: 'Error al procesar la calificación' });
  }
}

export async function getServiceRatingReport(req: Request, res: Response) {
  try {
    const report = await ServiceRatingModel.getServiceRatingReport();
    res.json(report[0]);
  } catch (error) {
    console.error('Error al obtener reporte de calificaciones:', error);
    res.status(500).json({ error: 'Error al obtener reporte de calificaciones' });
  }
}

export async function getServiceRatings(req: Request, res: Response) {
  try {
    const serviceId = Number(req.params.serviceId);
    const ratings = await ServiceRatingModel.getServiceRatingsByService(serviceId);
    res.json(ratings);
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
}