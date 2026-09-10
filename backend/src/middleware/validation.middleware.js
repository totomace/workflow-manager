const { z } = require('zod');
const { ValidationError } = require('./errorHandler');

/**
 * Validation middleware factory
 * Creates middleware that validates request body, query, and params against Zod schemas
 *
 * @param {Object} schemas - Object containing Zod schemas for body, query, params
 * @param {z.ZodSchema} [schemas.body] - Schema for request body validation
 * @param {z.ZodSchema} [schemas.query] - Schema for query parameters validation
 * @param {z.ZodSchema} [schemas.params] - Schema for URL parameters validation
 * @returns {import('express').RequestHandler} Express middleware
 */
function validate(schemas) {
  return (req, res, next) => {
    try {
      // Validate body if schema provided
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));
          throw new ValidationError('Validation failed', { errors });
        }
        req.body = result.data;
      }

      // Validate query if schema provided
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          const errors = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));
          throw new ValidationError('Validation failed', { errors });
        }
        req.query = result.data;
      }

      // Validate params if schema provided
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          const errors = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));
          throw new ValidationError('Validation failed', { errors });
        }
        req.params = result.data;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Common reusable validation schemas
 */
const commonSchemas = {
  // MongoDB ObjectId or numeric ID
  idParam: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),

  // Pagination
  paginationQuery: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  }),

  // Date range query
  dateRangeQuery: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // Period query (week, month, year, all)
  periodQuery: z.object({
    period: z.enum(['week', 'month', 'year', 'all']).optional(),
  }),
};

module.exports = {
  validate,
  commonSchemas,
  z,
};