const prisma = require("../../lib/prisma");

const createTag = async (data) => {
    return prisma.tag.create({
        data
    });
};

const findTagByName = async (name) => {
    return prisma.tag.findUnique({
        where: {
            name
        }
    });
};

const findTagById = async (id) => {
    return prisma.tag.findUnique({
        where: {
            id
        }
    });
};

const findTags = async () => {
    return prisma.tag.findMany({
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

const updateTag = async (id, data) => {
    return prisma.tag.update({
        where: { id },
        data
    });
};

const deleteTag = async (id) => {
    return prisma.tag.delete({
        where: { id }
    });
};


module.exports = {
    createTag,
    findTagByName,
    findTagById,
    findTags,
    updateTag,
    deleteTag
};