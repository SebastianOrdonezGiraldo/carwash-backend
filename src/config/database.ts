// src/config/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Verificar que la variable de entorno esté definida
if (!process.env.DATABASE_URL) {
  console.error('ERROR: La variable DATABASE_URL no está definida en el archivo .env');
  console.error('Por favor, crea un archivo .env con la variable DATABASE_URL');
  console.error('La aplicación podría fallar sin una URL de base de datos válida');
}

console.log('Conectando a la base de datos...');

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
    console.log('✅ Conexión a la base de datos exitosa');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
}

export default pool;