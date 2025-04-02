import express from 'express';
import * as employeeController from '../controllers/employeeController';

const router = express.Router();

// Obtener todos los empleados
router.get('/', employeeController.getAllEmployees);

// Buscar empleados
router.get('/search/:term', employeeController.searchEmployees);

// Obtener empleado por ID
router.get('/:id', employeeController.getEmployeeById);

// Crear empleado
router.post('/', employeeController.createEmployee);

// Actualizar empleado
router.put('/:id', employeeController.updateEmployee);

// Cambiar estado del empleado
router.patch('/:id/status', employeeController.changeEmployeeStatus);

// Eliminar empleado
router.delete('/:id', employeeController.deleteEmployee);

export default router;