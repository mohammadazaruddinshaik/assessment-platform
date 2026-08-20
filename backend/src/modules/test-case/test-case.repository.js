const prisma = require("../../lib/prisma");


const createTestCase = async (data) => {
    return prisma.testCase.create({
        data
    });
};


const createBulkTestCases = async (data) => {
    return prisma.$transaction(
        data.map((testCase) =>
            prisma.testCase.create({
                data: testCase
            })
        )
    );
};


const findById = async (id) => {
    return prisma.testCase.findUnique({
        where: {
            id
        }
    });
};


const findByQuestionId = async (questionId) => {
    return prisma.testCase.findMany({
        where: {
            questionId
        },
        orderBy: {
            displayOrder: "asc"
        }
    });
};


const findByQuestionAndDisplayOrder = async (
    questionId,
    displayOrder
) => {
    return prisma.testCase.findUnique({
        where: {
            questionId_displayOrder: {
                questionId,
                displayOrder
            }
        }
    });
};


const findQuestionById = async (questionId) => {
    return prisma.question.findUnique({
        where: {
            id: questionId
        }
    });
};


const updateTestCase = async (id, data) => {
    return prisma.testCase.update({
        where: {
            id
        },
        data
    });
};


const deleteTestCase = async (id) => {
    return prisma.testCase.delete({
        where: {
            id
        }
    });
};


module.exports = {
    createTestCase,
    createBulkTestCases,
    findById,
    findByQuestionId,
    findByQuestionAndDisplayOrder,
    findQuestionById,
    updateTestCase,
    deleteTestCase
};