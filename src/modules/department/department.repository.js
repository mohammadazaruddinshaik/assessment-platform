const prisma = require("../../lib/prisma");

const createDepartment = async (tx, departmentData) => {
    return tx.department.create({
        data: departmentData
    });
};

const getDepartmentById = async (departmentId) => {
    return await prisma.department.findUnique({
        where: { id: departmentId },
    });
};

const updateDepartment = async (departmentId, data) => {
    return await prisma.department.update({
        where: { id: departmentId },
        data,
    });
};

const deleteDepartment = async (departmentId) => {
    return await prisma.department.delete({
        where: { id: departmentId },
    });
};

const listDepartments = async () => {
    return await prisma.department.findMany();
};


module.exports = {
    createDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    listDepartments
};
