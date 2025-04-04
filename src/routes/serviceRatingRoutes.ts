// src/routes/serviceRatingRoutes.ts
import express from 'express';
import * as serviceRatingController from '../controllers/serviceRatingController';

const router = express.Router();

// Ruta para calificar un servicio
router.post('/:serviceId', serviceRatingController.rateService);

// Ruta para obtener reporte de calificaciones
router.get('/report', serviceRatingController.getServiceRatingReport);

// Ruta para obtener calificaciones de un servicio específico
router.get('/:serviceId/ratings', serviceRatingController.getServiceRatings);

export default router;