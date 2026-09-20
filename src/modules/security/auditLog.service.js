const auditLogRepository = require("./auditLog.repository");

const createAuditLog = async ({
    actorType,
    actorId,
    targetType,
    targetId,
    action,
    description,
    oldData,
    newData,
    ipAddress,
    deviceType,
    operatingSystem,
}) => {
    return await auditLogRepository.createAuditLog({
        actorType,
        actorId: actorId || null,
        targetType,
        targetId: targetId || null,
        action,
        description: description || null,
        oldData: oldData || null,
        newData: newData || null,
        ipAddress: ipAddress || null,
        deviceType: deviceType || null,
        operatingSystem: operatingSystem || null,
    });
};

const getAllAuditLogs = async () => {
    return await auditLogRepository.getAllAuditLogs();
};

const getAuditLogsByTarget = async (targetType, targetId) => {
    return await auditLogRepository.getAuditLogsByTarget(
        targetType,
        targetId
    );
};

module.exports = {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogsByTarget,
};