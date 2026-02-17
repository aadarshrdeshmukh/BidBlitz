import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware to validate request body against a Zod schema.
 * It also strips away any unexpected fields (strict validation).
 */
export const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData: any = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Replace req.body/query/params with validated data to ensure only expected fields are present
        req.body = validatedData.body;
        req.query = validatedData.query;
        req.params = validatedData.params;

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            });
        }
        next(error);
    }
};
