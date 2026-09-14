const assignmentRepository = require("./assignment.repository");

const acceptAssignment = async (assignmentId, user) => {
    // Only technicians can accept assignments
    if (user.role !== "technician") {
        throw new Error("Only technicians can accept assignments");
    }

    const assignment =
        await assignmentRepository.findAssignmentById(assignmentId);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    // Make sure the assignment belongs to the logged-in technician
    if (assignment.technicianId !== user.id) {
        throw new Error("You are not authorized to accept this assignment");
    }

    // Assignment must still be pending
    if (assignment.status !== "PENDING") {
        throw new Error("Assignment is no longer pending");
    }

    return await assignmentRepository.acceptAssignment(
        assignmentId,
        assignment.orderId
    );
};

const rejectAssignment = async (assignmentId, user) => {
    // Only technicians can reject assignments
    if (user.role !== "technician") {
        throw new Error("Only technicians can reject assignments");
    }

    const assignment =
        await assignmentRepository.findAssignmentById(assignmentId);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    // Make sure the assignment belongs to the logged-in technician
    if (assignment.technicianId !== user.id) {
        throw new Error("You are not authorized to reject this assignment");
    }

    // Assignment must still be pending
    if (assignment.status !== "PENDING") {
        throw new Error("Assignment is no longer pending");
    }

    return await assignmentRepository.rejectAssignment(assignmentId);
};

module.exports = {
    acceptAssignment,
    rejectAssignment,
};