const prisma = require("../../config/prisma");

const createLoginLog = async (data) => {
    return await prisma.loginLog.create({
        data,
    });
};

const getAllLoginLogs = async () => {
    return await prisma.loginLog.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

module.exports = {
    createLoginLog,
    getAllLoginLogs,
};