import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para ejecutar consultas SQL
export async function query(sql: string, params: any[] = []): Promise<any> {
  try {
    const { rows } = await pool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    throw error;
  }
}

// Verificar la conexión a la base de datos
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    console.log('Conexión a la base de datos exitosa');
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
}

export default pool;