const crypto = require("crypto");

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const HASH_ALGORITHM = "sha256";

const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        throw new Error("ENCRYPTION_KEY is not configured");
    }

    const buffer = Buffer.from(key, "hex");

    if (buffer.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 bytes");
    }

    return buffer;
};

const encrypt = (text) => {
    if (text === null || text === undefined) {
        return null;
    }

    const key = getEncryptionKey();

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        ENCRYPTION_ALGORITHM,
        key,
        iv
    );

    let encrypted = cipher.update(
        String(text),
        "utf8",
        "hex"
    );

    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

const decrypt = (encryptedText) => {
    if (!encryptedText) {
        return null;
    }

    const key = getEncryptionKey();

    const [ivHex, authTagHex, encryptedHex] =
        encryptedText.split(":");

    if (!ivHex || !authTagHex || !encryptedHex) {
        throw new Error("Invalid encrypted data format");
    }

    const decipher = crypto.createDecipheriv(
        ENCRYPTION_ALGORITHM,
        key,
        Buffer.from(ivHex, "hex")
    );

    decipher.setAuthTag(
        Buffer.from(authTagHex, "hex")
    );

    let decrypted = decipher.update(
        encryptedHex,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
};

const hash = (text) => {
    if (text === null || text === undefined) {
        return null;
    }

    const key = getEncryptionKey();

    return crypto
        .createHmac(HASH_ALGORITHM, key)
        .update(String(text), "utf8")
        .digest("hex");
};

module.exports = {
    encrypt,
    decrypt,
    hash,
};