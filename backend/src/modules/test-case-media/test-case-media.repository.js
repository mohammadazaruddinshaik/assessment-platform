const prisma = require("../../lib/prisma");


// =====================================================
// CREATE
// =====================================================

const create = async (testCaseId, data) => {
    return prisma.testCaseMedia.create({
        data: {
            testCaseId,
            type: data.type,
            url: data.url,
            altText: data.altText,
            displayOrder: data.displayOrder
        }
    });
};


// =====================================================
// FIND BY ID
// =====================================================

const findById = async (id) => {
    return prisma.testCaseMedia.findUnique({
        where: {
            id
        }
    });
};


// =====================================================
// FIND BY TEST CASE
// =====================================================

const findByTestCaseId = async (testCaseId) => {
    return prisma.testCaseMedia.findMany({
        where: {
            testCaseId
        },

        orderBy: {
            displayOrder: "asc"
        }
    });
};


// =====================================================
// FIND BY TEST CASE + DISPLAY ORDER
// =====================================================

const findByTestCaseAndDisplayOrder = async (
    testCaseId,
    displayOrder,
    excludeMediaId = null
) => {
    return prisma.testCaseMedia.findFirst({
        where: {
            testCaseId,
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
    return prisma.testCaseMedia.update({
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
    return prisma.testCaseMedia.delete({
        where: {
            id
        }
    });
};


module.exports = {
    create,
    findById,
    findByTestCaseId,
    findByTestCaseAndDisplayOrder,
    update,
    remove
};