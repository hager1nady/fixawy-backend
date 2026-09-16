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

module.exports = {
    createFollowUp,
    findFollowUpByOrderId,
};