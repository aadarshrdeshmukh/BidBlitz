import { z } from 'zod';

export const createAuctionSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(100).trim(),
        description: z.string().max(1000).trim().optional(),
        startingBid: z.number().nonnegative(),
        minIncrement: z.number().positive().optional(),
        imageUrl: z.string().optional(), // Can be data URI or URL
        category: z.string().optional(),
        auctionType: z.enum(['regular', 'rapid']).optional(),
        durationMinutes: z.number().int().positive().optional(),
        durationSeconds: z.number().int().positive().optional(),
    }).strict(),
});

export const auctionIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Auction ID'), // MongoDB ObjectId regex
    }),
});
