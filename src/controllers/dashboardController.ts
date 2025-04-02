import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboardService';

export async function fetchDashboardStats(req: Request, res: Response) {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
}