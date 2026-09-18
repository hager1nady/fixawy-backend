const prisma = require("../../config/prisma");

const createFollowUp = async (data) => {
    return await prisma.followUp.create({
        data,
    });
};

const findFollowUpByOrderId = async (orderId) => {
    return await prisma.followUp.findUnique({
        where: {
            orderId,
        },
    });
};

const updateFollowUp = async (id, data) => {
    return await prisma.followUp.update({
        where: {
            id,
        },
        data,
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
    createFollowUp,
    findFollowUpByOrderId,
    updateFollowUp,
    findOrderById,
};