const ApiError = require("../../utils/api-error");

const testCaseMediaRepository =
    require("./test-case-media.repository");

const testCaseRepository =
    require("../test-case/test-case.repository");

const {
    uploadImage,
    deleteImage
} = require("../../utils/cloudinary-upload");


// =====================================================
// CREATE MEDIA
// =====================================================

const createTestCaseMedia = async (
    testCaseId,
    data,
    file
) => {
    // Check TestCase exists
    const testCase =
        await testCaseRepository.findById(
            testCaseId
        );

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
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
        await testCaseMediaRepository
            .findByTestCaseAndDisplayOrder(
                testCaseId,
                data.displayOrder
            );

    if (existingMedia) {
        throw new ApiError(
            409,
            "Display order is already used by another media item",
            "TEST_CASE_MEDIA_DISPLAY_ORDER_EXISTS"
        );
    }


    let mediaUrl = data.url;
    let publicId = null;


    // Upload file to Cloudinary
    if (file) {
        try {
            const uploaded =
                await uploadImage(file);

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


    return testCaseMediaRepository.create(
        testCaseId,
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

const getTestCaseMediaById = async (
    testCaseId,
    mediaId
) => {
    const testCase =
        await testCaseRepository.findById(
            testCaseId
        );

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
        );
    }


    const media =
        await testCaseMediaRepository.findById(
            mediaId
        );

    if (
        !media ||
        media.testCaseId !== testCaseId
    ) {
        throw new ApiError(
            404,
            "Test case media not found",
            "TEST_CASE_MEDIA_NOT_FOUND"
        );
    }


    return media;
};


// =====================================================
// GET ALL MEDIA
// =====================================================

const getTestCaseMedias = async (
    testCaseId
) => {
    const testCase =
        await testCaseRepository.findById(
            testCaseId
        );

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
        );
    }


    return testCaseMediaRepository
        .findByTestCaseId(testCaseId);
};


// =====================================================
// UPDATE MEDIA
// =====================================================

const updateTestCaseMedia = async (
    testCaseId,
    mediaId,
    data,
    file
) => {
    const testCase =
        await testCaseRepository.findById(
            testCaseId
        );

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
        );
    }


    const existingMedia =
        await testCaseMediaRepository.findById(
            mediaId
        );

    if (
        !existingMedia ||
        existingMedia.testCaseId !== testCaseId
    ) {
        throw new ApiError(
            404,
            "Test case media not found",
            "TEST_CASE_MEDIA_NOT_FOUND"
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
            await testCaseMediaRepository
                .findByTestCaseAndDisplayOrder(
                    testCaseId,
                    data.displayOrder,
                    mediaId
                );

        if (conflictingMedia) {
            throw new ApiError(
                409,
                "Display order is already used by another media item",
                "TEST_CASE_MEDIA_DISPLAY_ORDER_EXISTS"
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
            uploaded = await uploadImage(file);
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
                // The old file may need later cleanup.
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


    return testCaseMediaRepository.update(
        mediaId,
        updateData
    );
};


// =====================================================
// DELETE MEDIA
// =====================================================

const deleteTestCaseMedia = async (
    testCaseId,
    mediaId
) => {
    const testCase =
        await testCaseRepository.findById(
            testCaseId
        );

    if (!testCase) {
        throw new ApiError(
            404,
            "Test case not found",
            "TEST_CASE_NOT_FOUND"
        );
    }


    const existingMedia =
        await testCaseMediaRepository.findById(
            mediaId
        );

    if (
        !existingMedia ||
        existingMedia.testCaseId !== testCaseId
    ) {
        throw new ApiError(
            404,
            "Test case media not found",
            "TEST_CASE_MEDIA_NOT_FOUND"
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


    await testCaseMediaRepository.remove(
        mediaId
    );
};


module.exports = {
    createTestCaseMedia,
    getTestCaseMediaById,
    getTestCaseMedias,
    updateTestCaseMedia,
    deleteTestCaseMedia
};