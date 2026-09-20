const prisma = require("../../config/prisma");

const createAuditLog = async (data) => {
    return await prisma.auditLog.create({
        data,
    });
};

const getAllAuditLogs = async () => {
    return await prisma.auditLog.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getAuditLogsByTarget = async (targetType, targetId) => {
    return await prisma.auditLog.findMany({
        where: {
            targetType,
            targetId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

module.exports = {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogsByTarget,
};