import express from 'express';
import * as reportController from '../controllers/reportController';

const router = express.Router();

// Obtener reportes generales
router.get('/', reportController.getReports);

export default router;