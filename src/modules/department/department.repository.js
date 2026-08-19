const prisma = require("../../lib/prisma");

const createDepartment = (data) => {
    return prisma.department.create({
        data,
    });
};

const getDepartmentById = (departmentId) => {
    return await prisma.department.findUnique({
        where: { id: departmentId },
    });
};

const updateDepartment = (departmentId, data) => {
    return prisma.department.update({
        where: { id: departmentId },
        data,
    });
};

const deleteDepartment = (departmentId) => {
    return prisma.department.delete({
        where: { id: departmentId },
    });
};

const listDepartments = () => {
    return prisma.department.findMany();
};


module.exports = {
    createDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    listDepartments
};
