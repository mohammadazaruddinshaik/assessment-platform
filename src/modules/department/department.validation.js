const { z } = require("zod");

const createDepartmentSchema = z.object({
    name: z.string(),
    organizationId: z.string().uuid("Invalid Organization ID format")
});

const getDepartmentByIdSchema = z.object({ id: z.string().uuid("Invalid Department ID format") }); 

const updateDepartmentSchema = z.object({ name: z.string(), id: z.string().uuid("Invalid Department ID format") });

const deleteDepartmentSchema = z.object({ id: z.string().uuid("Invalid Department ID format") });

module.exports = {
    createDepartmentSchema,
    getDepartmentByIdSchema,
    updateDepartmentSchema,
    deleteDepartmentSchema
};