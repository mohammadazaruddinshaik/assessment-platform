const prisma = require("../../lib/prisma");


// =====================================================
// CREATE
// =====================================================

const create = async (
    questionId,
    data
) => {
    return prisma.codingQuestionConfig.create({
        data: {
            questionId,
            executionMode: data.executionMode,
            timeLimitMs: data.timeLimitMs,
            memoryLimitMb: data.memoryLimitMb
        }
    });
};


// =====================================================
// FIND BY QUESTION ID
// =====================================================

const findByQuestionId = async (
    questionId
) => {
    return prisma.codingQuestionConfig.findUnique({
        where: {
            questionId
        }
    });
};


// =====================================================
// UPDATE
// =====================================================

const update = async (
    questionId,
    data
) => {
    return prisma.codingQuestionConfig.update({
        where: {
            questionId
        },

        data
    });
};


// =====================================================
// DELETE
// =====================================================

const remove = async (
    questionId
) => {
    return prisma.codingQuestionConfig.delete({
        where: {
            questionId
        }
    });
};


module.exports = {
    create,
    findByQuestionId,
    update,
    remove
};