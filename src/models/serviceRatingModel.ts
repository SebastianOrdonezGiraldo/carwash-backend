// src/models/serviceRatingModel.ts
import { query } from '../config/database';

export interface ServiceRating {
  id?: number;
  service_id: number;
  wait_time_rating: number;
  staff_friendliness_rating: number;
  service_quality_rating: number;
  customer_comment?: string;
  created_at?: Date;
}

export async function createServiceRating(rating: ServiceRating) {
  const result = await query(
    `INSERT INTO service_ratings 
    (service_id, wait_time_rating, staff_friendliness_rating, 
     service_quality_rating, customer_comment) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      rating.service_id,
      rating.wait_time_rating,
      rating.staff_friendliness_rating,
      rating.service_quality_rating,
      rating.customer_comment || null
    ]
  );
  
  return result[0];
}

export async function getServiceRatingReport() {
  return query(`
    SELECT 
      ROUND(AVG(wait_time_rating), 2) as avg_wait_time,
      ROUND(AVG(staff_friendliness_rating), 2) as avg_staff_friendliness,
      ROUND(AVG(service_quality_rating), 2) as avg_service_quality,
      COUNT(*) as total_ratings
    FROM service_ratings
  `);
}

export async function getServiceRatingsByService(serviceId: number) {
  return query(
    'SELECT * FROM service_ratings WHERE service_id = $1 ORDER BY created_at DESC',
    [serviceId]
  );
}

export async function checkServiceCompletedStatus(serviceId: number) {
  const result = await query(
    'SELECT status FROM pending_services WHERE service_id = $1',
    [serviceId]
  );
  
  return result.length > 0 && result[0].status === 'completed';
}