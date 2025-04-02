// src/routes/pendingServiceRoutes.ts
import express from 'express';
import * as pendingServiceController from '../controllers/pendingServiceController';

const router = express.Router();

// Obtener todos los servicios pendientes
router.get('/', pendingServiceController.getAllPendingServices);

// Obtener servicios por estado
router.get('/status/:status', pendingServiceController.getServicesByStatus);

// Buscar servicios
router.get('/search/:term', pendingServiceController.searchPendingServices);

// Obtener un servicio por ID
router.get('/:id', pendingServiceController.getPendingServiceById);

// Crear un nuevo servicio
router.post('/', pendingServiceController.createPendingService);

// Actualizar un servicio
router.put('/:id', pendingServiceController.updatePendingService);

// Asignar servicio a un empleado
router.patch('/:id/assign', pendingServiceController.assignServiceToEmployee);

// Marcar servicio como completado
router.patch('/:id/complete', pendingServiceController.markServiceAsComplete);

// Eliminar un servicio
router.delete('/:id', pendingServiceController.deletePendingService);

export default router;