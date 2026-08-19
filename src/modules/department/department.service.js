const departmentRepository = require("./department.repository");

const createDepartment = async (departmentData) => {
    const newDepartmentPayload = {
        departmentName: departmentData.name,
    };

    const createdDepartment =
        await departmentRepository.createDepartment(
            newDepartmentPayload
        );

    return createdDepartment;
};

const getDeparmentById = async (departmentData) => {

    const existingDepartment = await departmentRepository.getDeparmentById(departmentData.id);

    if(!existingDepartment) {
        throw new Error(" department not found");
    }
    return existingDepartment;
};

const updateDepartment = async (id, departmentData) => {
    const existingDepartment = await departmentRepository.getDeparmentById(id);

    if (!existingDepartment) {
        throw new Error("Department not found");
    }
    await departmentRepository.updateDepartment(id, departmentData);
    return await departmentRepository.getDeparmentById(id);
};

const deleteDepartment = async (id) => {
    const existingDepartment = await departmentRepository.getDeparmentById(id);

    if (!existingDepartment) {
        throw new Error("Department not found");
    }
    const department = await departmentRepository.deleteDepartment(id);
    return department;
};

const listDepartments = async () => {
    const departments = await departmentRepository.listDepartments();
    return departments;
};

module.exports = {
    createDepartment,
    getDeparmentById,
    updateDepartment,
    deleteDepartment,
    listDepartments
};