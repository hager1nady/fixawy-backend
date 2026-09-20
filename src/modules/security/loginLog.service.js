const loginLogRepository = require("./loginLog.repository");

const createLoginLog = async ({
    userType,
    userId,
    email,
    status,
    ipAddress,
    deviceType,
    operatingSystem,
    failureReason,
}) => {
    try {
        const loginLog = await loginLogRepository.createLoginLog({
            userType,
            userId: userId || null,
            email: email || null,
            status,
            ipAddress: ipAddress || null,
            deviceType: deviceType || null,
            operatingSystem: operatingSystem || null,
            failureReason: failureReason || null,
        });

        console.log("LOGIN LOG CREATED:", loginLog);

        return loginLog;
    } catch (error) {
        console.error("LOGIN LOG ERROR:", error);
        throw error;
    }
};

const getAllLoginLogs = async () => {
    return await loginLogRepository.getAllLoginLogs();
};

module.exports = {
    createLoginLog,
    getAllLoginLogs,
};