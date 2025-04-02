import express from 'express';
import * as vehicleController from '../controllers/vehicleController';

const router = express.Router();

// Obtener todos los vehículos
router.get('/', vehicleController.getAllVehicles);

// Buscar vehículos
router.get('/search/:term', vehicleController.searchVehicles);

// Obtener vehículos de un cliente
router.get('/customer/:customerId', vehicleController.getVehiclesByCustomer);

// Obtener vehículo por ID
router.get('/:id', vehicleController.getVehicleById);

// Crear vehículo
router.post('/', vehicleController.createVehicle);

// Actualizar vehículo
router.put('/:id', vehicleController.updateVehicle);

// Eliminar vehículo
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
