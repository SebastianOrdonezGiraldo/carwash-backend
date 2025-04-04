// src/routes/serviceRatingLinkRoutes.ts
import express from 'express';
import * as serviceRatingLinkController from '../controllers/serviceRatingLinkController';

const router = express.Router();

// Generar enlace de calificación para un servicio
router.post('/:serviceId/generate-link', serviceRatingLinkController.generateRatingLink);

// Validar enlace de calificación
router.get('/validate/:token', serviceRatingLinkController.validateRatingLink);

export default router;