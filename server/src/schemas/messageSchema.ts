import { z } from 'zod';

export const getMessagesSchema = z.object({
    params: z.object({
        auctionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Auction ID'),
    }),
});
