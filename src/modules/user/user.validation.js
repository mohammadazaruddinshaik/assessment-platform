// src/modules/user/user.validation.js
const { z } = require('zod');
const ApiError = require('../../utils/api-error');



const createUserSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(100),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email format").max(255),
    phone: z.string().max(20).optional().nullable(),
    organizationId: z.string().uuid("Invalid Organization ID format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^[a-zA-Z0-9]+$/, "Password must contain only letters and numbers"),
    roleId: z.string().uuid(),
    departmentId: z.string().uuid(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LOCKED']).optional()
});


const bulkUserSchema = z.array(createUserSchema);


const updateUserSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").max(100).optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(100).optional(),
    email: z.string().email("Invalid email format").max(255).optional(),
    phone: z.string().max(20).optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'LOCKED']).optional()
});

const findUserByIdSchema = z.object({
    id: z.string().uuid("Invalid User ID format")
});

const deleteUserSchema = z.object({
    id: z.string().uuid("Invalid User ID format")
});



module.exports = {
    createUserSchema,
    bulkUserSchema,
    updateUserSchema,
    deleteUserSchema
};  
