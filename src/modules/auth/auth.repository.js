const prisma = require("../../lib/prisma");

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};

module.exports = {
    findUserByEmail
};