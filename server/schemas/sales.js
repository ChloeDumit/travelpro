import { z } from 'zod';

export const createSaleSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().min(1, 'Description is required')
});

export const updateSaleSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  description: z.string().min(1, 'Description is required').optional()
}); 