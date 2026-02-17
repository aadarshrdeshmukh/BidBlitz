import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(30).trim(),
        email: z.string().email().toLowerCase().trim(),
        password: z.string().min(8).max(100),
    }).strict(),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email().toLowerCase().trim(),
        password: z.string().min(1, 'Password is required'),
    }).strict(),
});

export const topUpSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be a positive number'),
    }).strict(),
});
