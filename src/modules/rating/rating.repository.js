const prisma = require("../../config/prisma");

const findCompletedOrder = async (orderId) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            status: "COMPLETED",
        },
        include: {
            payments: {
                where: {
                    paymentStatus: "PAID",
                },
            },
            assignments: {
                where: {
                    status: "ACCEPTED",
                },
                include: {
                    technician: true,
                },
            },
            client: true,
        },
    });
};

const findExistingRating = async (orderId, raterId) => {
    return await prisma.rating.findFirst({
        where: {
            orderId,
            raterId,
        },
    });
};

const createRating = async (data) => {
    return await prisma.rating.create({
        data,
    });
};

const getTechnicianRatings = async (technicianId) => {
    return await prisma.rating.findMany({
        where: {
            ratedType: "technician",
            ratedId: technicianId,
        },
        select: {
            rating: true,
        },
    });
};

const updateTechnicianRating = async (technicianId, averageRating) => {
    return await prisma.technician.update({
        where: {
            id: technicianId,
        },
        data: {
            averageRating,
        },
    });
};

module.exports = {
    findCompletedOrder,
    findExistingRating,
    createRating,
    getTechnicianRatings,
    updateTechnicianRating,
};