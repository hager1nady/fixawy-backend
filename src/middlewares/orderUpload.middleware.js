const multer = require("multer");

const storage = multer.memoryStorage();

const orderUpload = multer({
    storage,

    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
    },

    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image and video files are allowed"));
        }
    },
});

module.exports = orderUpload;