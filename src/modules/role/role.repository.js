const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const createRole = async (roleData) => {
    return await prisma.role.create({
        data: roleData,
    });
};


const deleteRole = async (roleId) => {
    return await prisma.role.delete({
        where: { id: roleId },
    });
};


const getRoleById = async (roleId) => {
    return await prisma.role.findUnique({
        where: { id: roleId },
    });
};


const updateRole = async (roleId, roleData) => {
    return await prisma.role.update({
        where: { id: roleId },
        data: roleData,
    });
};


const listRoles = async () => {
    return await prisma.role.findMany();
};


module.exports = {
    createRole,
    deleteRole,
    getRoleById,
    updateRole
};