// src/services/serviceRatingLinkService.ts
import crypto from 'crypto';
import { query } from '../config/database';

// Interfaz para el enlace de calificación
export interface ServiceRatingLink {
  id?: number;
  service_id: number;
  unique_token: string;
  is_used: boolean;
  created_at?: Date;
  expires_at: Date;
}

// Generar un token único
function generateUniqueToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Crear un enlace de calificación
export async function createServiceRatingLink(serviceId: number): Promise<string> {
  // Verificar si ya existe un enlace no usado
  const existingLink = await query(
    'SELECT unique_token FROM service_rating_links WHERE service_id = $1 AND is_used = false AND expires_at > CURRENT_TIMESTAMP',
    [serviceId]
  );

  if (existingLink.length > 0) {
    return existingLink[0].unique_token;
  }

  // Generar nuevo token
  const uniqueToken = generateUniqueToken();
  
  // Establecer expiración en 30 días
  await query(
    `INSERT INTO service_rating_links 
    (service_id, unique_token, is_used, expires_at) 
    VALUES ($1, $2, false, CURRENT_TIMESTAMP + INTERVAL '30 days')`,
    [serviceId, uniqueToken]
  );

  return uniqueToken;
}

// Validar enlace de calificación
export async function validateServiceRatingLink(token: string): Promise<number | null> {
  const result = await query(
    `SELECT service_id FROM service_rating_links 
    WHERE unique_token = $1 
    AND is_used = false 
    AND expires_at > CURRENT_TIMESTAMP`,
    [token]
  );

  return result.length > 0 ? result[0].service_id : null;
}

// Marcar enlace como usado
export async function markServiceRatingLinkAsUsed(token: string): Promise<void> {
  await query(
    'UPDATE service_rating_links SET is_used = true WHERE unique_token = $1',
    [token]
  );
}