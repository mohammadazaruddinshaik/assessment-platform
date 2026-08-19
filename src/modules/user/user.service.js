const bcrypt = require('bcrypt');
const userRepository = require('./user.repository');
const ApiError = require('../../utils/api-error');

const createUser = async (userData, organizationId) => {

    const hashedPassword = await bcrypt.hash(
        userData.password,
        10
    );

    const newUserPayload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        organizationId: organizationId,
        passwordHash: hashedPassword,
        status: userData.status || "ACTIVE"
    };

    const createdUser = await prisma.$transaction(async (tx) => {

        const user = await userRepository.createUser(
            tx,
            newUserPayload
        );

        await userRepository.createUserRole(
            tx,
            {
                userId: user.id,
                roleId: userData.roleId
            }
        );

        await userRepository.createUserDepartment(
            tx,
            {
                userId: user.id,
                depId: userData.departmentId
            }
        );

        return user;
    });

    delete createdUser.passwordHash;

    return createdUser;
};

const getUserProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);
    
    if (!user) {
        throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    
    delete user.passwordHash;
    
    return user;
};

const createUsersInBulk = async (users, organizationId) => {

    const saltRounds = 10;

    const hashedPasswords = await Promise.all(
        users.map(user =>
            bcrypt.hash(user.password, saltRounds)
        )
    );

    const userPayloads = users.map((user, index) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        organizationId: organizationId,
        passwordHash: hashedPasswords[index],
        status: user.status || "ACTIVE",
    }));

    // Transaction
    const result = await prisma.$transaction(async (tx) => {

        const createdUsers = await userRepository.createUsersInBulk(
            tx,
            userPayloads
        );

        const userRoles = createdUsers.map((user, index) => ({
            userId: user.id,
            roleId: users[index].roleId,
        }));

        await userRepository.createUserRoles(
            tx,
            userRoles
        );

        const userDepartments = createdUsers.map((user, index) => ({
            userId: user.id,
            depId: users[index].departmentId,
        }));

        await userRepository.createUserDepartments(
            tx,
            userDepartments
        );

        return createdUsers;
    });

    return {
        count: result.length
    };
};

const updateUser = async (userId, userData) => {
    const existingUser = await userRepository.findUserById(userId);
    if (!existingUser) {
        throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    
    const user = {};
    if (userData.firstName) user.firstName = userData.firstName;
    if (userData.lastName) user.lastName = userData.lastName;
    if (userData.email) user.email = userData.email;
    if (userData.phone) user.phone = userData.phone;
    if (userData.status) user.status = userData.status;

    const updatedUser = await userRepository.updateUser(userId, user);

    delete updatedUser.passwordHash;

    return updatedUser;
};

const deleteUser = async (userId) => {
    const existingUser = await userRepository.findUserById(userId);
    if (!existingUser) {
        throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    await userRepository.deleteUser(userId);
};

module.exports = {
    createUser,
    getUserProfile,
    createUsersInBulk,
    updateUser,
    deleteUser
};
