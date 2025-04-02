import express from 'express';
import * as serviceController from '../controllers/serviceController';

const router = express.Router();

// Obtener todos los servicios
router.get('/', serviceController.getAllServices);

// Obtener categorías de servicios
router.get('/categories', serviceController.getAllServiceCategories);

// Obtener servicios por categoría
router.get('/category/:categoryId', serviceController.getServicesByCategory);

// Obtener servicio por ID
router.get('/:id', serviceController.getServiceById);

// Crear servicio
router.post('/', serviceController.createService);

// Crear categoría de servicio
router.post('/categories', serviceController.createServiceCategory);

// Actualizar servicio
router.put('/:id', serviceController.updateService);

// Eliminar servicio
router.delete('/:id', serviceController.deleteService);

export default router;
