const prisma = require("../../lib/prisma");

const createUser = async (db, userData) => {
    return db.user.create({
        data: userData
    });
};

const createUserRole = async (db, data) => {

    return db.userRole.create({
        data: {
            user: {
                connect: {
                    id: data.userId
                }
            },

            role: {
                connect: {
                    id: data.roleId
                }
            },

            assignedByUser: {
                connect: {
                    id: data.assignedByUserId
                }
            }
        }
    });
};

const createUserDepartment = async (db, data) => {
    return db.userDepartment.create({
        data: {
            departmentSection: {
                connect: {
                    id: data.depId
                }
            },
            user: {
                connect: {
                    id: data.userId
                }
            }
        }
    });
};

const findUserById = async (userId) => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userRoles: {
                include: {
                    role: true 
                }
            },
            organization: true,
            departments: true
        }
    });
};

const createUsersInBulk = async (db, users) => {

    return db.user.createManyAndReturn({
        data: users
    });

};

const createUserRoles = async (db, userRoles) => {

    return db.userRole.createMany({
        data: userRoles
    });

};

const createUserDepartments = async (db, departments) => {

    return db.department.createMany({
        data: departments
    });

};

const updateUser = async (userId, userData) => {
    return await prisma.user.update({
        where: { id: userId },
        data: userData
    });
};

const deleteUser = async (userId) => {
    return await prisma.user.delete({
        where: { id: userId }
    });
}

module.exports = {
    createUser,
    createUserRole,
    createUserDepartment,
    findUserById,
    createUsersInBulk,
    createUserRoles,
    createUserDepartments,
    updateUser,
    deleteUser
};


