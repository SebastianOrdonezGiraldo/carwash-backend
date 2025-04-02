import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vehicle_spruce_system',
  port: Number(process.env.DB_PORT) || 3306
};

// Crear pool de conexiones
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para ejecutar consultas SQL
export async function query(sql: string, params: any[] = []): Promise<any> {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    throw error;
  }
}

// Verificar la conexión a la base de datos
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
}

export default pool;
