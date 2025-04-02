import { Request, Response } from 'express';
import * as reportService from '../services/reportService';

export async function getReports(req: Request, res: Response) {
  try {
    const reports = await reportService.getReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      error: 'Error al obtener reportes', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}