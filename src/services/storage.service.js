const supabase = require("../config/supabase");

const uploadFile = async (file, bucket, folder) => {
    if (!file) {
        throw new Error("File is required");
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (error) {
        throw new Error(`File upload failed: ${error.message}`);
    }

    return fileName;
};

module.exports = {
    uploadFile,
};