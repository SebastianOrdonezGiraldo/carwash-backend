import express from 'express';
import { fetchDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/stats', fetchDashboardStats);

export default router;