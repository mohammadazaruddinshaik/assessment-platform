const service = require("./test-case.service");


const createTestCase = async (req, res, next) => {
    try {
        const testCase = await service.createTestCase(
            req.validated.body
        );

        res.status(201).json({
            success: true,
            message: "Test case created successfully",
            data: testCase
        });
    } catch (error) {
        next(error);
    }
};


const createBulkTestCases = async (req, res, next) => {
    try {
        const { questionId } = req.validated.params;
        const { testCases } = req.validated.body;

        const createdTestCases =
            await service.createBulkTestCases(
                questionId,
                testCases
            );

        res.status(201).json({
            success: true,
            message: "Test cases created successfully",
            data: createdTestCases
        });
    } catch (error) {
        next(error);
    }
};


const getTestCaseById = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const testCase = await service.getTestCaseById(id);

        res.status(200).json({
            success: true,
            data: testCase
        });
    } catch (error) {
        next(error);
    }
};


const getTestCasesByQuestionId = async (req, res, next) => {
    try {
        const { questionId } = req.validated.params;

        const testCases =
            await service.getTestCasesByQuestionId(questionId);

        res.status(200).json({
            success: true,
            data: testCases
        });
    } catch (error) {
        next(error);
    }
};


const updateTestCase = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const data = req.validated.body;

        const testCase = await service.updateTestCase(
            id,
            data
        );

        res.status(200).json({
            success: true,
            message: "Test case updated successfully",
            data: testCase
        });
    } catch (error) {
        next(error);
    }
};


const deleteTestCase = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        await service.deleteTestCase(id);

        res.status(200).json({
            success: true,
            message: "Test case deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createTestCase,
    createBulkTestCases,
    getTestCaseById,
    getTestCasesByQuestionId,
    updateTestCase,
    deleteTestCase
};