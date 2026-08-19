const roleService = require('./role.service');
const ApiResponse = require('../../utils/api-response');
const asyncHandler = require('../../utils/async-handler');



const createRole = asyncHandler(async (req, res) => {
    const roleData = req.body;
    const newRole = await roleService.createRole(roleData);
    return ApiResponse.created(res, newRole, 'Role created successfully');
});


const deleteRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await roleService.deleteRole(id);
    return ApiResponse.success(res, null, 'Role deleted successfully');
});


const getRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    return ApiResponse.success(res, role, 'Role fetched successfully');
});


const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const roleData = req.body;
    const updatedRole = await roleService.updateRole(id, roleData);
    return ApiResponse.success(
        res,
        updatedRole, 
        'Role updated successfully');  
});


const listRoles = asyncHandler(async (req, res) => {
    const roles = await roleService.listRoles();
    return ApiResponse.success(
        res, 
        roles,
        'Roles fetched successfully');
});



module.exports = {
    createRole,
    deleteRole,
    getRoleById,
    updateRole,
    listRoles
};