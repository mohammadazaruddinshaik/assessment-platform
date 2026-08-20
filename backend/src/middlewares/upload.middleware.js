const multer = require("multer");


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("Only image files are allowed")
        );
    }

    cb(null, true);
};


const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter
});


const uploadSingleImage = upload.single("file");


module.exports = {
    uploadSingleImage
};