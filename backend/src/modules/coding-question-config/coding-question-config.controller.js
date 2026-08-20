const codingQuestionConfigService =
    require("./coding-question-config.service");

const ApiResponse =
    require("../../utils/api-response");


// =====================================================
// CREATE
// =====================================================

const createCodingQuestionConfig = async (
    req,
    res
) => {
    const config =
        await codingQuestionConfigService
            .createCodingQuestionConfig(
                req.validated.params.questionId,
                req.validated.body
            );

    return ApiResponse.created(
        res,
        config,
        "Coding question configuration created successfully"
    );
};


// =====================================================
// GET
// =====================================================

const getCodingQuestionConfig = async (
    req,
    res
) => {
    const config =
        await codingQuestionConfigService
            .getCodingQuestionConfig(
                req.validated.params.questionId
            );

    return ApiResponse.success(
        res,
        config,
        "Coding question configuration fetched successfully"
    );
};


// =====================================================
// UPDATE
// =====================================================

const updateCodingQuestionConfig = async (
    req,
    res
) => {
    const config =
        await codingQuestionConfigService
            .updateCodingQuestionConfig(
                req.validated.params.questionId,
                req.validated.body
            );

    return ApiResponse.success(
        res,
        config,
        "Coding question configuration updated successfully"
    );
};


// =====================================================
// DELETE
// =====================================================

const deleteCodingQuestionConfig = async (
    req,
    res
) => {
    await codingQuestionConfigService
        .deleteCodingQuestionConfig(
            req.validated.params.questionId
        );

    return ApiResponse.success(
        res,
        null,
        "Coding question configuration deleted successfully"
    );
};


module.exports = {
    createCodingQuestionConfig,
    getCodingQuestionConfig,
    updateCodingQuestionConfig,
    deleteCodingQuestionConfig
};