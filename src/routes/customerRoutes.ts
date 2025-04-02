import express from 'express';
import * as customerController from '../controllers/customerController';

const router = express.Router();

// Obtener todos los clientes
router.get('/', customerController.getAllCustomers);

// Buscar clientes
router.get('/search/:term', customerController.searchCustomers);

// Obtener cliente por ID
router.get('/:id', customerController.getCustomerById);

// Obtener cliente con sus vehículos
router.get('/:id/vehicles', customerController.getCustomerWithVehicles);

// Crear cliente
router.post('/', customerController.createCustomer);

// Actualizar cliente
router.put('/:id', customerController.updateCustomer);

// Eliminar cliente
router.delete('/:id', customerController.deleteCustomer);

export default router;
