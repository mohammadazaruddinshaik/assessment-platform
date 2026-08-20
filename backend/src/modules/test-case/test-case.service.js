const ApiError = require("../../utils/api-error");

const repository = require("./test-case.repository");


const createTestCase = async (data) => {
    // Check whether the question exists
    const question = await repository.findQuestionById(
        data.questionId
    );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    // Check duplicate display order
    const existingTestCase =
        await repository.findByQuestionAndDisplayOrder(
            data.questionId,
            data.displayOrder
        );

    if (existingTestCase) {
        throw new ApiError(
            409,
            "A test case with this display order already exists for this question",
            "TEST_CASE_ORDER_EXISTS"
        );
    }

    return repository.createTestCase(data);
};


const createBulkTestCases = async (
    questionId,
    testCases
) => {
    // Check whether the question exists
    const question = await repository.findQuestionById(
        questionId
    );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    // Check duplicate display orders inside request
    const displayOrders = testCases.map(
        (testCase) => testCase.displayOrder
    );

    const uniqueDisplayOrders = new Set(
        displayOrders
    );

    if (
        uniqueDisplayOrders.size !==
        displayOrders.length
    ) {
        throw new ApiError(
            409,
            "Duplicate display orders are not allowed",
            "DUPLICATE_DISPLAY_ORDER"
        );
    }

    // Get existing test cases for this question
    const existingTestCases =
        await repository.findByQuestionId(questionId);

    const existingDisplayOrders = new Set(
        existingTestCases.map(
            (testCase) => testCase.displayOrder
        )
    );

    // Check whether any new test case conflicts
    // with an existing display order
    const conflictingTestCase = testCases.find(
        (testCase) =>
            existingDisplayOrders.has(
                testCase.displayOrder
            )
    );

    if (conflictingTestCase) {
        throw new ApiError(
            409,
            `Test case with display order ${conflictingTestCase.displayOrder} already exists for this question`,
            "TEST_CASE_ORDER_EXISTS"
        );
    }

    // Add questionId to every test case
    const data = testCases.map((testCase) => ({
        ...testCase,
        questionId
    }));

    // Create all test cases in a transaction
    return repository.createBulkTestCases(data);
};


const getTestCaseById = async (id) => {
    const testCase = await repository.findById(id);

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
        );
    }

    return testCase;
};


const getTestCasesByQuestionId = async (questionId) => {
    return repository.findByQuestionId(questionId);
};


const updateTestCase = async (id, data) => {
    const testCase = await getTestCaseById(id);

    // Check display order conflict only if displayOrder is changing
    if (
        data.displayOrder !== undefined &&
        data.displayOrder !== testCase.displayOrder
    ) {
        const existingTestCase =
            await repository.findByQuestionAndDisplayOrder(
                testCase.questionId,
                data.displayOrder
            );

        if (
            existingTestCase &&
            existingTestCase.id !== id
        ) {
            throw new ApiError(
                409,
                "A test case with this display order already exists for this question",
                "TEST_CASE_ORDER_EXISTS"
            );
        }
    }

    return repository.updateTestCase(id, data);
};


const deleteTestCase = async (id) => {
    await getTestCaseById(id);

    return repository.deleteTestCase(id);
};


module.exports = {
    createTestCase,
    createBulkTestCases,
    getTestCaseById,
    getTestCasesByQuestionId,
    updateTestCase,
    deleteTestCase
};