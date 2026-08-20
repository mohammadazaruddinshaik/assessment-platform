const ApiError = require("../../utils/api-error");

const testCaseMediaRepository =
    require("./test-case-media.repository");

const testCaseRepository =
    require("../test-case/test-case.repository");

const {
    uploadImage
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


    // Upload file to Cloudinary
    if (file) {
        try {
            const uploaded =
                await uploadImage(file);

            mediaUrl = uploaded.url;
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


    // If a new file is provided, upload it
    if (file) {
        try {
            const uploaded =
                await uploadImage(file);

            updateData.url = uploaded.url;
        } catch (error) {
            throw new ApiError(
                500,
                "Failed to upload media",
                "MEDIA_UPLOAD_FAILED"
            );
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