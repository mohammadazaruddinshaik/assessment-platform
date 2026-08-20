const questionMediaService =
    require("./question-media.service");

const ApiResponse =
    require("../../utils/api-response");


const createQuestionMedia = async (req, res) => {
    const media =
        await questionMediaService.createQuestionMedia(
            req.validated.params.questionId,
            req.validated.body,
            req.file
        );

    return ApiResponse.created(
        res,
        media,
        "Question media created successfully"
    );
};


const getQuestionMediaById = async (req, res) => {
    const media =
        await questionMediaService.getQuestionMediaById(
            req.validated.params.questionId,
            req.validated.params.mediaId
        );

    return ApiResponse.success(
        res,
        media,
        "Question media fetched successfully"
    );
};


const getQuestionMedias = async (req, res) => {
    const media =
        await questionMediaService.getQuestionMedias(
            req.validated.params.questionId
        );

    return ApiResponse.success(
        res,
        media,
        "Question media fetched successfully"
    );
};


const updateQuestionMedia = async (req, res) => {
    const media =
        await questionMediaService.updateQuestionMedia(
            req.validated.params.questionId,
            req.validated.params.mediaId,
            req.validated.body,
            req.file
        );

    return ApiResponse.success(
        res,
        media,
        "Question media updated successfully"
    );
};


const deleteQuestionMedia = async (req, res) => {
    await questionMediaService.deleteQuestionMedia(
        req.validated.params.questionId,
        req.validated.params.mediaId
    );

    return ApiResponse.success(
        res,
        null,
        "Question media deleted successfully"
    );
};


module.exports = {
    createQuestionMedia,
    getQuestionMediaById,
    getQuestionMedias,
    updateQuestionMedia,
    deleteQuestionMedia
};