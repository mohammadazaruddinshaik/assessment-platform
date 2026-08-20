const ApiError = require("../../utils/api-error");

const questionMediaRepository =
    require("./question-media.repository");

const questionRepository =
    require("../question/question.repository");

const {
    uploadImage,
    deleteImage
} = require("../../utils/cloudinary-upload");


// =====================================================
// CREATE MEDIA
// =====================================================

const createQuestionMedia = async (
    questionId,
    data,
    file
) => {
    // Check Question exists
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    // URL and file cannot be provided together
    if (data.url && file) {
        throw new ApiError(
            400,
            "Provide either a URL or an image file, not both",
            "MEDIA_SOURCE_CONFLICT"
        );
    }


    // Either URL or file is required
    if (!data.url && !file) {
        throw new ApiError(
            400,
            "Either a URL or an image file is required",
            "MEDIA_SOURCE_REQUIRED"
        );
    }


    // Check displayOrder
    const existingMedia =
        await questionMediaRepository
            .findByQuestionAndDisplayOrder(
                questionId,
                data.displayOrder
            );

    if (existingMedia) {
        throw new ApiError(
            409,
            "Display order is already used by another media item",
            "QUESTION_MEDIA_DISPLAY_ORDER_EXISTS"
        );
    }


    let mediaUrl = data.url;
    let publicId = null;


    // Upload file to Cloudinary
    if (file) {
        try {
            const uploaded =
                await uploadImage(
                    file,
                    "assessment-platform/question-media"
                );

            mediaUrl = uploaded.url;
            publicId = uploaded.publicId;
        } catch (error) {
            throw new ApiError(
                500,
                "Failed to upload media",
                "MEDIA_UPLOAD_FAILED"
            );
        }
    }


    return questionMediaRepository.create(
        questionId,
        {
            type: data.type,
            url: mediaUrl,
            publicId,
            altText: data.altText,
            displayOrder: data.displayOrder
        }
    );
};


// =====================================================
// GET MEDIA BY ID
// =====================================================

const getQuestionMediaById = async (
    questionId,
    mediaId
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const media =
        await questionMediaRepository.findById(
            mediaId
        );

    if (
        !media ||
        media.questionId !== questionId
    ) {
        throw new ApiError(
            404,
            "Question media not found",
            "QUESTION_MEDIA_NOT_FOUND"
        );
    }


    return media;
};


// =====================================================
// GET ALL MEDIA
// =====================================================

const getQuestionMedias = async (
    questionId
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    return questionMediaRepository
        .findByQuestionId(questionId);
};


// =====================================================
// UPDATE MEDIA
// =====================================================

const updateQuestionMedia = async (
    questionId,
    mediaId,
    data,
    file
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const existingMedia =
        await questionMediaRepository.findById(
            mediaId
        );

    if (
        !existingMedia ||
        existingMedia.questionId !== questionId
    ) {
        throw new ApiError(
            404,
            "Question media not found",
            "QUESTION_MEDIA_NOT_FOUND"
        );
    }


    // URL and file cannot both be provided
    if (data.url && file) {
        throw new ApiError(
            400,
            "Provide either a URL or an image file, not both",
            "MEDIA_SOURCE_CONFLICT"
        );
    }


    // Check displayOrder conflict
    if (
        data.displayOrder !== undefined &&
        data.displayOrder !==
            existingMedia.displayOrder
    ) {
        const conflictingMedia =
            await questionMediaRepository
                .findByQuestionAndDisplayOrder(
                    questionId,
                    data.displayOrder,
                    mediaId
                );

        if (conflictingMedia) {
            throw new ApiError(
                409,
                "Display order is already used by another media item",
                "QUESTION_MEDIA_DISPLAY_ORDER_EXISTS"
            );
        }
    }


    const updateData = {
        ...data
    };


    // Replace with a newly uploaded file
    if (file) {
        let uploaded;

        try {
            uploaded = await uploadImage(
                    file,
                    "assessment-platform/question-media"
                );
        } catch (error) {
            throw new ApiError(
                500,
                "Failed to upload media",
                "MEDIA_UPLOAD_FAILED"
            );
        }

        updateData.url = uploaded.url;
        updateData.publicId = uploaded.publicId;

        // Remove old Cloudinary image
        if (existingMedia.publicId) {
            try {
                await deleteImage(
                    existingMedia.publicId
                );
            } catch (error) {
                // New file was successfully uploaded,
                // so don't fail the update because cleanup failed.
            }
        }
    }


    // Switching from Cloudinary image to external URL
    if (data.url && existingMedia.publicId) {
        updateData.publicId = null;

        try {
            await deleteImage(
                existingMedia.publicId
            );
        } catch (error) {
            // Continue with DB update
        }
    }


    return questionMediaRepository.update(
        mediaId,
        updateData
    );
};


// =====================================================
// DELETE MEDIA
// =====================================================

const deleteQuestionMedia = async (
    questionId,
    mediaId
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const existingMedia =
        await questionMediaRepository.findById(
            mediaId
        );

    if (
        !existingMedia ||
        existingMedia.questionId !== questionId
    ) {
        throw new ApiError(
            404,
            "Question media not found",
            "QUESTION_MEDIA_NOT_FOUND"
        );
    }


    // Delete from Cloudinary only if this media
    // was uploaded by our application
    if (existingMedia.publicId) {
        try {
            await deleteImage(
                existingMedia.publicId
            );
        } catch (error) {
            throw new ApiError(
                500,
                "Failed to delete media from Cloudinary",
                "MEDIA_DELETE_FAILED"
            );
        }
    }


    await questionMediaRepository.remove(
        mediaId
    );
};


module.exports = {
    createQuestionMedia,
    getQuestionMediaById,
    getQuestionMedias,
    updateQuestionMedia,
    deleteQuestionMedia
};