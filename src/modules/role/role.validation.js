const { z } = require('zod');
const ApiError = require('../../utils/api-error');


const createRoleSchema = z.object({
    name: z.string().min(2, "Role name must be at least 2 characters").max(100),
    description: z.string().max(255).optional(),
    code: z.string().max(50).optional(),
    organizationId: z.string().uuid("Invalid Organization ID format")
});

const deleteRoleSchema = z.object({ name: z.string().min(2, "Role name must be at least 2 characters").max(100) });

const getRoleByIdSchema = z.object({ id: z.string().uuid("Invalid Role ID format") });

const updateRoleSchema = z.object({
    id: z.string().uuid("Invalid Role ID format"),
    name: z.string().min(2, "Role name must be at least 2 characters").max(100).optional(),
    description: z.string().max(255).optional(),
    code: z.string().max(50).optional(),
    organizationId: z.string().uuid("Invalid Organization ID format")
});

module.exports = {
    createRoleSchema,
    deleteRoleSchema,
    getRoleByIdSchema,
    updateRoleSchema
};