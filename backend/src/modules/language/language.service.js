const languageRepository = require("./language.repository");
const ApiError = require("../../utils/api-error.js");

const createLanguage = async (data) => {
    const existingLanguage =
        await languageRepository.findLanguageByCode(data.code);

    if (existingLanguage) {
        throw new ApiError(
            409,
            "Language code already exists",
            "LANGUAGE_CODE_ALREADY_EXISTS"
        );
    }
    return languageRepository.createLanguage(data);
};

const listLanguages = async (filters) => {
    return languageRepository.findLanguages(filters);
};


const getLanguageById = async (languageId) => {
    const language =
        await languageRepository.findLanguageById(languageId);

    if (!language) {
        throw new ApiError(
            404,
            "Language not found",
            "LANGUAGE_NOT_FOUND"
        );
    }

    return language;
};

const updateLanguage = async (languageId, data) => {
    const existingLanguage =
        await languageRepository.findLanguageById(languageId);

    if (!existingLanguage) {
        throw new ApiError(
            404,
            "Language not found",
            "LANGUAGE_NOT_FOUND"
        );
    }

    return languageRepository.updateLanguage(
        languageId,
        data
    );
};


const deleteLanguage = async (languageId) => {
    const language =
        await languageRepository.findLanguageById(languageId);

    if (!language) {
        throw new ApiError(
            404,
            "Language not found",
            "LANGUAGE_NOT_FOUND"
        );
    }

    if (language.status === "INACTIVE") {
        throw new ApiError(
            409,
            "Language is already inactive",
            "LANGUAGE_ALREADY_INACTIVE"
        );
    }

    return languageRepository.deactivateLanguage(languageId);
};



module.exports = {
    createLanguage,
    listLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
};