const departmentService = require("./department.service");
const ApiResponse = require("../../utils/api-response");
const asyncHandler = require("../../utils/async-handler");

const createDepartment = asyncHandler(async (req, res) => {
    const departmentData = req.body;

    const newDepartment =
        await departmentService.createDepartment(departmentData);

    return ApiResponse.created(
        res,
        newDepartment,
        "Department created successfully"
    );
});


const getDepartmentById = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id);
    return ApiResponse.success(
        res,
        department,
        "department fetched successfully"
    )

});


const updateDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const departmentData = req.body;
    const updatedDepartment = await departmentService.updateDepartment(id, departmentData);
    return ApiResponse.created()(
        res,
        updatedDepartment,
        "Department updated successfully"
    );
});

const deleteDepartment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await departmentService.deleteDepartment(id);
    return ApiResponse.success(
        res,
        null,
        "Department deleted successfully"
    );
});

const listDepartments = asyncHandler(async (req, res) => {
    const departments = await departmentService.listDepartments(req.params.id);
    return ApiResponse.success(
        res, 
        departments,
         "Departments fetched successfully");
});


module.exports = {
    createDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    listDepartments
};
