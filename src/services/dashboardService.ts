import { query } from '../config/database';

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  // Vehículos pendientes
  const pendingVehicles = await query(`
    SELECT COUNT(*) as total 
    FROM pending_services 
    WHERE status IN ('pending', 'in-progress')
  `);

  // Empleados activos
  const activeEmployees = await query(`
    SELECT COUNT(*) as total 
    FROM employees 
    WHERE status = 'active'
  `);

  // Tiempo promedio de servicio
  const avgServiceTime = await query(`
    SELECT AVG(EXTRACT(EPOCH FROM (estimated_completion_time - entry_time))/60) as avg_time 
    FROM pending_services
  `);

  // Ingresos del día
  const dailyIncome = await query(`
    SELECT COALESCE(SUM(total_cost), 0) as total 
    FROM work_orders 
    WHERE DATE(start_date) = CURRENT_DATE
  `);

  // Servicios pendientes
  const pendingServices = await query(`
    SELECT 
      ps.service_id,
      v.license_plate,
      v.make,
      v.model,
      s.name as service_name,
      c.name as client_name,
      ps.status,
      ps.entry_time
    FROM pending_services ps
    JOIN vehicles v ON ps.vehicle_id = v.vehicle_id
    JOIN services s ON ps.service_type_id = s.service_id
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE ps.status IN ('pending', 'in-progress', 'delayed')
    ORDER BY ps.entry_time DESC
    LIMIT 5
  `);

  // Inventario con stock bajo
  const lowStockItems = await query(`
    SELECT 
      name, 
      quantity, 
      reorder_level 
    FROM inventory 
    WHERE quantity <= reorder_level
    ORDER BY (quantity::float / reorder_level) ASC
    LIMIT 3
  `);

  return {
    pendingVehicles: pendingVehicles[0].total,
    activeEmployees: activeEmployees[0].total,
    avgServiceTime: Math.round(avgServiceTime[0].avg_time || 0),
    dailyIncome: Math.round(dailyIncome[0].total),
    pendingServices,
    lowStockItems
  };
}