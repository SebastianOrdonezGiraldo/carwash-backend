import { query } from '../config/database';

// Interfaces para los tipos de resultados de la base de datos
interface DailyIncomeRow {
  day: string;
  income: string | number;
}

interface ServiceTypeRow {
  name: string;
  percentage: string | number;
}

interface ServiceTimeRow {
  type: string;
  time: string | number;
}

interface VehicleHistoryRow {
  date: string;
  services: string | number;
}

interface SummaryStatsRow {
  total_income: string | number;
  daily_average: string | number;
  best_day: string;
  total_services: string | number;
  avg_service_time: string | number;
}

// Interfaz para los datos de los reportes (igual que antes)
export interface ReportData {
  dailyIncomeData: Array<{ day: string; income: number }>;
  serviceTypeData: Array<{ name: string; value: number }>;
  serviceTimeData: Array<{ type: string; time: number }>;
  vehicleHistoryData: Array<{ date: string; services: number }>;
  summaryStats: {
    totalIncome: number;
    dailyAverage: number;
    bestDay: string;
    totalServices: number;
    avgServiceTime: number;
  };
}

export async function getReports(): Promise<ReportData> {
  // Obtener ingresos diarios
  const dailyIncomeResults = await query(`
    SELECT 
      TO_CHAR(start_date, 'Day') as day, 
      COALESCE(SUM(total_cost), 0) as income 
    FROM work_orders 
    WHERE start_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY TO_CHAR(start_date, 'Day')
    ORDER BY MAX(start_date)
  `) as DailyIncomeRow[];

  // Distribución de tipos de servicio
  const serviceTypeResults = await query(`
    SELECT 
      sc.name, 
      COUNT(ps.service_id) as total_services,
      ROUND(COUNT(ps.service_id) * 100.0 / (SELECT COUNT(*) FROM pending_services), 2) as percentage
    FROM pending_services ps
    JOIN services s ON ps.service_type_id = s.service_id
    JOIN service_categories sc ON s.category_id = sc.category_id
    GROUP BY sc.name
  `) as ServiceTypeRow[];

  // Tiempo promedio por tipo de servicio
  const serviceTimeResults = await query(`
    SELECT 
      sc.name as type, 
      ROUND(AVG(EXTRACT(EPOCH FROM (ps.estimated_completion_time - ps.entry_time))/60)) as time
    FROM pending_services ps
    JOIN services s ON ps.service_type_id = s.service_id
    JOIN service_categories sc ON s.category_id = sc.category_id
    GROUP BY sc.name
  `) as ServiceTimeRow[];

  // Historial de servicios por vehículo
  const vehicleHistoryResults = await query(`
    SELECT 
      TO_CHAR(start_date, 'DD/MM') as date, 
      COUNT(order_id) as services 
    FROM work_orders 
    WHERE start_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY TO_CHAR(start_date, 'DD/MM')
    ORDER BY start_date
    LIMIT 6
  `) as VehicleHistoryRow[];

  // Estadísticas resumidas
  const summaryStatsResult = await query(`
    SELECT 
      COALESCE(SUM(total_cost), 0) as total_income,
      ROUND(COALESCE(AVG(total_cost), 0), 2) as daily_average,
      (
        SELECT TO_CHAR(start_date, 'Day') 
        FROM (
          SELECT start_date, SUM(total_cost) as daily_total 
          FROM work_orders 
          GROUP BY start_date 
          ORDER BY daily_total DESC 
          LIMIT 1
        ) best_day
      ) as best_day,
      COUNT(*) as total_services,
      ROUND(AVG(EXTRACT(EPOCH FROM (estimated_completion_time - entry_time))/60), 2) as avg_service_time
    FROM pending_services
  `) as SummaryStatsRow[];

  return {
    dailyIncomeData: dailyIncomeResults.map(row => ({
      day: row.day.trim().substring(0, 3),
      income: Number(row.income)
    })),
    serviceTypeData: serviceTypeResults.map(row => ({
      name: row.name,
      value: Number(row.percentage)
    })),
    serviceTimeData: serviceTimeResults.map(row => ({
      type: row.type,
      time: Number(row.time)
    })),
    vehicleHistoryData: vehicleHistoryResults.map(row => ({
      date: row.date,
      services: Number(row.services)
    })),
    summaryStats: {
      totalIncome: Number(summaryStatsResult[0].total_income),
      dailyAverage: Number(summaryStatsResult[0].daily_average),
      bestDay: summaryStatsResult[0].best_day?.trim().substring(0, 3) || 'N/A',
      totalServices: Number(summaryStatsResult[0].total_services),
      avgServiceTime: Number(summaryStatsResult[0].avg_service_time)
    }
  };
}