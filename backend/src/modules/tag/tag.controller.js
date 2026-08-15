const tagService = require("./tag.service");
const ApiResponse = require("../../utils/api-response");

const createTag = async (req, res) => {
    const tag = await tagService.createTag(
        req.validated.body
    );

    return ApiResponse.created(
        res,
        tag,
        "Tag created successfully"
    );
};

const getTagById = async (req, res) => {
    const tag = await tagService.getTagById(
        req.validated.params.tagId
    );

    return ApiResponse.success(
        res,
        tag,
        "Tag fetched successfully"
    );
};

const listTags = async (req, res) => {
    const tags = await tagService.listTags();

    return ApiResponse.success(
        res,
        tags,
        "Tags fetched successfully"
    );
};


const updateTag = async (req, res) => {
    const tag = await tagService.updateTag(
        req.validated.params.tagId,
        req.validated.body
    );

    return ApiResponse.success(
        res,
        tag,
        "Tag updated successfully"
    );
};

const deleteTag = async (req, res) => {
    await tagService.deleteTag(
        req.validated.params.tagId
    );

    return ApiResponse.success(
        res,
        null,
        "Tag deleted successfully"
    );
};

module.exports = {
    createTag,
    getTagById,
    listTags,
    updateTag,
    deleteTag
};