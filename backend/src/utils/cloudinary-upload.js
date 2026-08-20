const cloudinary = require("../config/cloudinary");


const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "assessment-platform/test-case-media",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            );

        uploadStream.end(file.buffer);
    });
};


const deleteImage = async (publicId) => {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
    });
};


module.exports = {
    uploadImage,
    deleteImage
};