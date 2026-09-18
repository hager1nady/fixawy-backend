const prisma = require("../../config/prisma");

const createCallRecord = async (data) => {
    return await prisma.callRecord.create({
        data,
    });
};

const findCallRecordById = async (id) => {
    return await prisma.callRecord.findUnique({
        where: {
            id,
        },
    });
};

const getAllCallRecords = async () => {
    return await prisma.callRecord.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

module.exports = {
    createCallRecord,
    findCallRecordById,
    getAllCallRecords,
};