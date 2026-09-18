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
    return await loginLogRepository.createLoginLog({
        userType,
        userId: userId || null,
        email: email || null,
        status,
        ipAddress: ipAddress || null,
        deviceType: deviceType || null,
        operatingSystem: operatingSystem || null,
        failureReason: failureReason || null,
    });
};

const getAllLoginLogs = async () => {
    return await loginLogRepository.getAllLoginLogs();
};

module.exports = {
    createLoginLog,
    getAllLoginLogs,
};