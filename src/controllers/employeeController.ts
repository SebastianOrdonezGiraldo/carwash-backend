import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';

export async function getAllEmployees(req: Request, res: Response) {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
}

export async function getEmployeeById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const employee = await employeeService.getEmployeeById(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
}

export async function searchEmployees(req: Request, res: Response) {
  try {
    const term = req.params.term;
    const employees = await employeeService.searchEmployees(term);
    res.json(employees);
  } catch (error) {
    console.error('Error al buscar empleados:', error);
    res.status(500).json({ error: 'Error al buscar empleados' });
  }
}

export async function createEmployee(req: Request, res: Response) {
  try {
    console.log('Datos recibidos para crear empleado:', req.body);
    
    // Validar datos mínimos requeridos
    if (!req.body.name || !req.body.position || !req.body.hire_date) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios (nombre, cargo, fecha de contratación)' 
      });
    }
    
    // Preparar los datos para la base de datos
    const employeeData = {
      name: req.body.name,
      position: req.body.position,
      email: req.body.email || null,
      phone: req.body.phone || null,
      hire_date: req.body.hire_date,
      status: req.body.status || 'active'
    };
    
    const newEmployee = await employeeService.createEmployee(employeeData);
    res.status(201).json(newEmployee);
  } catch (error: any) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ 
      error: 'Error al crear empleado', 
      details: error.message
    });
  }
}

export async function updateEmployee(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedEmployee = await employeeService.updateEmployee(id, req.body);
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
}

export async function deleteEmployee(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await employeeService.deleteEmployee(id);
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
}

export async function changeEmployeeStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    if (status !== 'active' && status !== 'inactive') {
      return res.status(400).json({ error: 'Estado inválido. Debe ser "active" o "inactive"' });
    }
    
    const updatedEmployee = await employeeService.changeEmployeeStatus(id, status);
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error al cambiar estado del empleado:', error);
    res.status(500).json({ error: 'Error al cambiar estado del empleado' });
  }
}