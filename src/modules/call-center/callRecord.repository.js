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

const findOrderById = async (orderId) => {
    return await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            id: true,
            status: true,
        },
    });
};

module.exports = {
    createCallRecord,
    findCallRecordById,
    getAllCallRecords,
    findOrderById,
};