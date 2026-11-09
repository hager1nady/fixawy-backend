
const assignmentRepository = require("./assignment.repository");
const orderRepository = require("../order/order.repository");

const acceptAssignment = async (assignmentId, user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can accept assignments");
    }

    const assignment =
        await assignmentRepository.findAssignmentById(assignmentId);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    if (assignment.technicianId !== user.id) {
        throw new Error("You are not authorized to accept this assignment");
    }

    if (assignment.status !== "PENDING") {
        throw new Error("Assignment is no longer pending");
    }

    return await assignmentRepository.acceptAssignment(
        assignmentId,
        assignment.orderId
    );
};


const rejectAssignment = async (assignmentId, user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can reject assignments");
    }

    const assignment =
        await assignmentRepository.findAssignmentById(assignmentId);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    if (assignment.technicianId !== user.id) {
        throw new Error("You are not authorized to reject this assignment");
    }

    if (assignment.status !== "PENDING") {
        throw new Error("Assignment is no longer pending");
    }

    await assignmentRepository.rejectAssignment(assignmentId);

    const order = assignment.order;

    if (order.status !== "NEW") {
        return {
            message:
                "Assignment rejected. Order is no longer available for reassignment.",
            orderId: order.id,
            reassigned: false,
        };
    }

    const nextTechnician =
        await orderRepository.findNextSuitableTechnician(
            order.service ? order.service.subcategory : null,
            order.serviceLocation.split(",")[0].trim(),
            order.id
        );

    if (!nextTechnician) {
        return {
            message:
                "Assignment rejected. No alternative technician is currently available; call center follow-up is required.",
            orderId: order.id,
            reassigned: false,
            needsCallCenter: true,
        };
    }

    const newAssignment = await orderRepository.createAssignment(
        order.id,
        nextTechnician.id
    );

    return {
        message:
            "Assignment rejected and order reassigned to another technician",
        orderId: order.id,
        reassigned: true,
        assignment: newAssignment,
    };
};


module.exports = {
    acceptAssignment,
    rejectAssignment,
};
