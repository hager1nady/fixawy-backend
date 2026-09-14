const prisma = require("../../config/prisma");

const createOrder = async (orderData) => {
    return await prisma.order.create({
        data: orderData,
        include: {
            service: true,
            client: {
                select: {
                    id: true,
                    fullName: true,
                    mobileNumber: true,
                    email: true,
                    profilePicture: true,
                    currentLocation: true,
                    preferredLanguage: true,
                },
            },
        },
    });
};

const findServiceById = async (serviceId) => {
    return await prisma.catalogService.findUnique({
        where: { id: serviceId },
    });
};

// Find a suitable active technician
const findSuitableTechnician = async (subcategory, workArea) => {
    return await prisma.technician.findFirst({
        where: {
            specialty: subcategory,
            workArea: workArea,
            accountStatus: "ACTIVE",
        },
        orderBy: {
            averageRating: "desc",
        },
    });
};

// Create assignment between order and technician
const createAssignment = async (orderId, technicianId) => {
    return await prisma.assignment.create({
        data: {
            orderId,
            technicianId,
            status: "PENDING",
        },
        include: {
            technician: {
                select: {
                    id: true,
                    fullName: true,
                    mobileNumber: true,
                    profession: true,
                    specialty: true,
                    workArea: true,
                    averageRating: true,
                },
            },
        },
    });
};
const findOrderForTechnician = async (orderId, technicianId) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            assignments: {
                some: {
                    technicianId: technicianId,
                    status: "ACCEPTED",
                },
            },
        },
        include: {
            assignments: {
                include: {
                    technician: {
                        select: {
                            id: true,
                            fullName: true,
                            mobileNumber: true,
                            profession: true,
                            specialty: true,
                        },
                    },
                },
            },
            service: true,
        },
    });
};

const markOrderAsArrived = async (orderId) => {
    return await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            arrivalTime: new Date(),
        },
    });
};
const markOrderAsCompleted = async (orderId) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "COMPLETED",
            completionTime: new Date(),
        },
    });
};
const findOrderForCancellation = async (orderId, user) => {
    const where = {
        id: orderId,
    };

    if (user.role === "client") {
        where.clientId = user.id;
    } else if (user.role === "technician") {
        where.assignments = {
            some: {
                technicianId: user.id,
                status: "ACCEPTED",
            },
        };
    } else {
        return null;
    }

    return await prisma.order.findFirst({
        where,
    });
};
const cancelOrder = async (orderId, cancellationReason) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status: "CANCELLED",
            cancellationReason,
        },
    });
};

module.exports = {
    createOrder,
    findServiceById,
    findSuitableTechnician,
    createAssignment,
    findOrderForTechnician,
    markOrderAsArrived,
    markOrderAsCompleted,
    findOrderForCancellation,
    cancelOrder
};