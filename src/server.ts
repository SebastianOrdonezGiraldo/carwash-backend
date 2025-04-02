import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Importar rutas
import customerRoutes from './routes/customerRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import serviceRoutes from './routes/serviceRoutes';
import employeeRoutes from './routes/employeeRoutes';
import pendingServiceRoutes from './routes/pendingServiceRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import reportRoutes from './routes/reportRoutes';

// Configurar dotenv
dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verificar conexión con la base de datos
testConnection()
  .then(connected => {
    if (!connected) {
      console.error('No se pudo conectar a la base de datos');
    }
  });

// Rutas
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/pending-services', pendingServiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('API de Car Wash Pro funcionando correctamente');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});