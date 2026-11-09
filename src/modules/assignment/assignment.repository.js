const prisma = require("../../config/prisma");


const findAssignmentById = async (assignmentId) => {
    return await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
        },
        include: {
            order: {
                include: {
                    service: true,
                },
            },
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


const acceptAssignment = async (assignmentId, orderId) => {
    return await prisma.$transaction(async (tx) => {
        const assignment = await tx.assignment.update({
            where: {
                id: assignmentId,
            },
            data: {
                status: "ACCEPTED",
                respondedAt: new Date(),
            },
        });

        const order = await tx.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: "ONGOING",
                acceptanceTime: new Date(),
            },
        });

        return {
            assignment,
            order,
        };
    });
};

const rejectAssignment = async (assignmentId) => {
    return await prisma.assignment.update({
        where: {
            id: assignmentId,
        },
        data: {
            status: "REJECTED",
            respondedAt: new Date(),
        },
    });
};

module.exports = {
    findAssignmentById,
    acceptAssignment,
    rejectAssignment,
};