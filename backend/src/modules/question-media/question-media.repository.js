const prisma = require("../../lib/prisma");


// =====================================================
// CREATE
// =====================================================

const create = async (questionId, data) => {
    return prisma.questionMedia.create({
        data: {
            questionId,
            type: data.type,
            url: data.url,
            publicId: data.publicId,
            altText: data.altText,
            displayOrder: data.displayOrder
        }
    });
};


// =====================================================
// FIND BY ID
// =====================================================

const findById = async (id) => {
    return prisma.questionMedia.findUnique({
        where: {
            id
        }
    });
};


// =====================================================
// FIND BY QUESTION
// =====================================================

const findByQuestionId = async (questionId) => {
    return prisma.questionMedia.findMany({
        where: {
            questionId
        },

        orderBy: {
            displayOrder: "asc"
        }
    });
};


// =====================================================
// FIND BY QUESTION + DISPLAY ORDER
// =====================================================

const findByQuestionAndDisplayOrder = async (
    questionId,
    displayOrder,
    excludeMediaId = null
) => {
    return prisma.questionMedia.findFirst({
        where: {
            questionId,
            displayOrder,

            ...(excludeMediaId && {
                id: {
                    not: excludeMediaId
                }
            })
        }
    });
};


// =====================================================
// UPDATE
// =====================================================

const update = async (id, data) => {
    return prisma.questionMedia.update({
        where: {
            id
        },

        data
    });
};


// =====================================================
// DELETE
// =====================================================

const remove = async (id) => {
    return prisma.questionMedia.delete({
        where: {
            id
        }
    });
};


module.exports = {
    create,
    findById,
    findByQuestionId,
    findByQuestionAndDisplayOrder,
    update,
    remove
};