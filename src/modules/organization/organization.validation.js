const {z} = require("zod");

const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  displayName: z.string().optional(),
  description: z.string().max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  timezone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100).optional(),
  displayName: z.string().optional(),
  description: z.string().max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  address: z.string().optional(),
  timezone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

const getOrganizationByIdSchema = z.object({
  id: z.string().uuid("Invalid Organization ID format"),
});

const deleteOrganizationSchema = z.object({
  id: z.string().uuid("Invalid Organization ID format"),
});

module.exports = { 
    createOrganizationSchema,
    updateOrganizationSchema,
    deleteOrganizationSchema,
    getOrganizationByIdSchema,
};