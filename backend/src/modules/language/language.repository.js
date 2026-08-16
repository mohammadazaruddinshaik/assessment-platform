const prisma = require("../../lib/prisma");

const createLanguage = async (data) => {
    return prisma.language.create({
        data,
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const findLanguageByCode = async (code) => {
    return prisma.language.findUnique({
        where: {
            code
        },
        select: {
            id: true
        }
    });
};

const findLanguages = async ({ status } = {}) => {
    return prisma.language.findMany({
        where: status
            ? { status }
            : undefined,

        orderBy: {
            createdAt: "desc"
        },

        select: {
            id: true,
            name: true,
            code: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const findLanguageById = async (languageId) => {
    return prisma.language.findUnique({
        where: {
            id: languageId
        },
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const updateLanguage = async (languageId, data) => {
    return prisma.language.update({
        where: {
            id: languageId
        },
        data,
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const deactivateLanguage = async (languageId) => {
    return prisma.language.update({
        where: {
            id: languageId
        },
        data: {
            status: "INACTIVE"
        },
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};


module.exports = {
    createLanguage,
    findLanguageByCode,
    findLanguages,
    findLanguageById,
    updateLanguage,
    deactivateLanguage
};