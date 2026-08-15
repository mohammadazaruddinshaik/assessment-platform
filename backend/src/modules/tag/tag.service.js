const ApiError = require("../../utils/api-error");
const tagRepository = require("./tag.repository");

const createTag = async (data) => {
    const existingTag =
        await tagRepository.findTagByName(data.name);

    if (existingTag) {
        throw new ApiError(
            409,
            "Tag already exists",
            "TAG_ALREADY_EXISTS"
        );
    }

    return tagRepository.createTag({
        ...data,
        createdBy: "system",
        updatedBy: "system"
    });
};

const getTagById = async (tagId) => {
    const tag = await tagRepository.findTagById(tagId);

    if (!tag) {
        throw new ApiError(
            404,
            "Tag not found",
            "TAG_NOT_FOUND"
        );
    }

    return tag;
};

const listTags = async () => {
    return tagRepository.findTags();
};

const updateTag = async (tagId, data) => {
    const existingTag =
        await tagRepository.findTagById(tagId);

    if (!existingTag) {
        throw new ApiError(
            404,
            "Tag not found",
            "TAG_NOT_FOUND"
        );
    }

    if (data.name && data.name !== existingTag.name) {
        const duplicateTag =
            await tagRepository.findTagByName(data.name);

        if (duplicateTag) {
            throw new ApiError(
                409,
                "Tag already exists",
                "TAG_ALREADY_EXISTS"
            );
        }
    }

    return tagRepository.updateTag(
        tagId,
        {
            ...data,
            updatedBy: "system"
        }
    );
};

const deleteTag = async (tagId) => {
    const existingTag =
        await tagRepository.findTagById(tagId);

    if (!existingTag) {
        throw new ApiError(
            404,
            "Tag not found",
            "TAG_NOT_FOUND"
        );
    }

    await tagRepository.deleteTag(tagId);
};


module.exports = {
    createTag,
    getTagById,
    listTags,
    updateTag,
    deleteTag
};