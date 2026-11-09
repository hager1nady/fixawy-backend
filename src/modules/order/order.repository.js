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


const findNextSuitableTechnician = async (
    subcategory,
    workArea,
    orderId
) => {
    const previousAssignments = await prisma.assignment.findMany({
        where: { orderId },
        select: { technicianId: true },
    });

    const excludedTechnicianIds = previousAssignments.map(
        (assignment) => assignment.technicianId
    );

    return prisma.technician.findFirst({
        where: {
            specialty: subcategory,
            workArea: workArea,
            accountStatus: "ACTIVE",
            id: {
                notIn: excludedTechnicianIds,
            },
        },
        orderBy: {
            averageRating: "desc",
        },
    });
};


const findTechnicianById = async (technicianId) => {
    return await prisma.technician.findUnique({
        where: {
            id: technicianId,
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



const findOrdersForClient = async (clientId) => {
    return await prisma.order.findMany({
        where: {
            clientId: clientId,
        },
        include: {
            service: true,
            assignments: {
                include: {
                    technician: {
                        select: {
                            id: true,
                            fullName: true,
                            mobileNumber: true,
                            profession: true,
                            specialty: true,
                            averageRating: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};


const findOrdersForTechnician = async (technicianId) => {
    return await prisma.order.findMany({
        where: {
            assignments: {
                some: {
                    technicianId: technicianId,
                },
            },
        },
        include: {
            service: true,
            client: {
                select: {
                    id: true,
                    fullName: true,
                    mobileNumber: true,
                    currentLocation: true,
                },
            },
            assignments: {
                where: {
                    technicianId: technicianId,
                },
                select: {
                    id: true,
                    status: true,
                    assignedAt: true,
                    respondedAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};



const findOrderDetails = async (orderId, user) => {
    const where = {
        id: orderId,
    };

    if (user.role === "client") {
        where.clientId = user.id;
    } else if (user.role === "technician") {
        where.assignments = {
            some: {
                technicianId: user.id,
            },
        };
    } else {
        return null;
    }

    return await prisma.order.findFirst({
        where,
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
                },
            },
            assignments: {
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
            },
        },
    });
};


const findOrderByCode = async (orderCode, user) => {
    const where = {
        orderCode: orderCode.trim().toUpperCase(),
    };

    if (user.role === "client") {
        where.clientId = user.id;
    } else if (user.role === "technician") {
        where.assignments = {
            some: {
                technicianId: user.id,
            },
        };
    } else {
        return null;
    }

    return await prisma.order.findFirst({
        where,
        include: {
            service: true,
            client: {
                select: {
                    id: true,
                    fullName: true,
                    mobileNumber: true,
                    currentLocation: true,
                },
            },
            assignments: {
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
            },
        },
    });
};



module.exports = {
    createOrder,
    findServiceById,
    findSuitableTechnician,
    createAssignment,
    findNextSuitableTechnician,
    findOrderForTechnician,
    markOrderAsArrived,
    markOrderAsCompleted,
    findOrderForCancellation,
    cancelOrder,
    findOrdersForClient,
    findOrdersForTechnician,
    findOrderDetails,
    findOrderByCode,
    findTechnicianById,
};