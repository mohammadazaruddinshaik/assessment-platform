const languageService = require("./language.service");
const ApiResponse = require("../../utils/api-response.js");

const createLanguage = async (req, res) => {
    const language =
        await languageService.createLanguage(
            req.validated.body
        );

    return ApiResponse.success(
        res,
        language,
        "Language created successfully",
        201
    );
};

const listLanguages = async (req, res) => {
    const languages =
        await languageService.listLanguages(
            req.validated.query
        );

    return ApiResponse.success(
        res,
        languages,
        "Languages fetched successfully"
    );
};


const getLanguageById = async (req, res) => {
    const language =
        await languageService.getLanguageById(
            req.validated.params.languageId
        );

    return ApiResponse.success(
        res,
        language,
        "Language fetched successfully"
    );
};

const updateLanguage = async (req, res) => {
    const language =
        await languageService.updateLanguage(
            req.validated.params.languageId,
            req.validated.body
        );

    return ApiResponse.success(
        res,
        language,
        "Language updated successfully"
    );
};


const deleteLanguage = async (req, res) => {
    await languageService.deleteLanguage(
        req.validated.params.languageId
    );

    return ApiResponse.success(
        res,
        null,
        "Language deactivated successfully"
    );
};


module.exports = {
    createLanguage,
    listLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
};