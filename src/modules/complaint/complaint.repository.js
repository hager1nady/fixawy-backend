const prisma = require("../../config/prisma");

const findOrderForComplaint = async (orderId) => {
    return await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            client: true,
            assignments: {
                where: {
                    status: "ACCEPTED",
                },
                include: {
                    technician: true,
                },
            },
        },
    });
};

const createComplaint = async (data) => {
    return await prisma.complaint.create({
        data,
    });
};

const findExistingComplaint = async (orderId, complainantId) => {
    return await prisma.complaint.findFirst({
        where: {
            orderId,
            complainantId,
        },
    });
};

module.exports = {
    findOrderForComplaint,
    createComplaint,
    findExistingComplaint,
};