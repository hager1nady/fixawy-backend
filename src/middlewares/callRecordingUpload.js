const multer = require("multer");

const storage = multer.memoryStorage();

const callRecordingUpload = multer({
    storage,

    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("audio/")) {
            cb(null, true);
        } else {
            cb(new Error("Only audio files are allowed"));
        }
    },
});

module.exports = callRecordingUpload;