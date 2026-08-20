const testCaseMediaService =
    require("./test-case-media.service");

const ApiResponse =
    require("../../utils/api-response");


const createTestCaseMedia = async (req, res) => {
    const media =
        await testCaseMediaService.createTestCaseMedia(
            req.validated.params.testCaseId,
            req.validated.body,
            req.file
        );

    return ApiResponse.created(
        res,
        media,
        "Test case media created successfully"
    );
};


const getTestCaseMediaById = async (req, res) => {
    const media =
        await testCaseMediaService.getTestCaseMediaById(
            req.validated.params.testCaseId,
            req.validated.params.mediaId
        );

    return ApiResponse.success(
        res,
        media,
        "Test case media fetched successfully"
    );
};


const getTestCaseMedias = async (req, res) => {
    const media =
        await testCaseMediaService.getTestCaseMedias(
            req.validated.params.testCaseId
        );

    return ApiResponse.success(
        res,
        media,
        "Test case media fetched successfully"
    );
};


const updateTestCaseMedia = async (req, res) => {
    const media =
        await testCaseMediaService.updateTestCaseMedia(
            req.validated.params.testCaseId,
            req.validated.params.mediaId,
            req.validated.body,
            req.file
        );

    return ApiResponse.success(
        res,
        media,
        "Test case media updated successfully"
    );
};


const deleteTestCaseMedia = async (req, res) => {
    await testCaseMediaService.deleteTestCaseMedia(
        req.validated.params.testCaseId,
        req.validated.params.mediaId
    );

    return ApiResponse.success(
        res,
        null,
        "Test case media deleted successfully"
    );
};


module.exports = {
    createTestCaseMedia,
    getTestCaseMediaById,
    getTestCaseMedias,
    updateTestCaseMedia,
    deleteTestCaseMedia
};