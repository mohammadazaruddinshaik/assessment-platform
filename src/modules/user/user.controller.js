const userService = require('./user.service');
const ApiResponse = require('../../utils/api-response');
const asyncHandler = require('../../utils/async-handler');



const createUser = asyncHandler(async (req, res) => {

    const userData = req.body;

    const organizationId = req.user.organizationId;

    const createdUser = await userService.createUser(
        userData,
        organizationId
    );

    return ApiResponse.created(
        res,
        createdUser,
        "User created successfully"
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserProfile(id);

    return ApiResponse.success(
        res,
        user,
        'User profile retrieved successfully'
    );
});

const uploadBulkUsers = asyncHandler(async (req, res) => {
    const { users } = req.body;
    const organizationId = req.user.organizationId; 
    
    const result = await userService.createUsersInBulk(users, organizationId);

    return ApiResponse.created(
        res,
        { insertedCount: result.count },
        `Successfully imported ${result.count} users.`
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    return ApiResponse.created()(
        res,
        await userService.updateUser(id, userData),
        'User updated successfully'
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);

    return ApiResponse.success(
        res,
        null,
        'User deleted successfully'
    );
});

module.exports = {
    createUser,
    getUserById,
    uploadBulkUsers,
    updateUser,
    deleteUser
};
