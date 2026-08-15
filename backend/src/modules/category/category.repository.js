const prisma = require("../../lib/prisma");

const createCategory = async (data) => {
    return prisma.category.create({
        data
    });
};

const findCategoryByName = async (name) => {
    return prisma.category.findUnique({
        where: {
            name
        }
    });
};

const findCategoryById = async (id) => {
    return prisma.category.findUnique({
        where: {
            id
        }
    });
};

const findCategories = async () => {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const updateCategory = async (id, data) => {
    return prisma.category.update({
        where: { id },
        data
    });
};

const detachQuestionsFromCategory = async (categoryId, tx) => {
    return tx.question.updateMany({
        where: {
            categoryId
        },
        data: {
            categoryId: null
        }
    });
};

const deleteCategory = async (categoryId) => {
    return prisma.$transaction(async (tx) => {
        await detachQuestionsFromCategory(categoryId, tx);

        return tx.category.delete({
            where: {
                id: categoryId
            }
        });
    });
};


module.exports = {
    createCategory,
    findCategoryByName,
    findCategoryById,
    findCategories,
    updateCategory,
    detachQuestionsFromCategory,
    deleteCategory
};