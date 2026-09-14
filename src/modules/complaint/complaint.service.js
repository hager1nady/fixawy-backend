const complaintRepository = require("./complaint.repository");

const createComplaint = async (orderId, user, complaintData) => {
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error("Only clients or technicians can submit complaints");
    }

    const { reason, attachments } = complaintData;

    if (!reason || !reason.trim()) {
        throw new Error("Complaint reason is required");
    }

    const order = await complaintRepository.findOrderForComplaint(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const assignment = order.assignments[0];

    if (!assignment) {
        throw new Error("No accepted technician found for this order");
    }

    let complainantType;
    let complainantId;
    let againstType;
    let againstId;

    if (user.role === "client") {
        if (order.clientId !== user.id) {
            throw new Error("You are not authorized to complain about this order");
        }

        complainantType = "client";
        complainantId = user.id;

        againstType = "technician";
        againstId = assignment.technicianId;
    } else {
        if (assignment.technicianId !== user.id) {
            throw new Error("You are not authorized to complain about this order");
        }

        complainantType = "technician";
        complainantId = user.id;

        againstType = "client";
        againstId = order.clientId;
    }

    const existingComplaint =
        await complaintRepository.findExistingComplaint(
            orderId,
            user.id
        );

    if (existingComplaint) {
        throw new Error("You have already submitted a complaint for this order");
    }

    const complaint = await complaintRepository.createComplaint({
        complainantType,
        complainantId,
        againstType,
        againstId,
        reason: reason.trim(),
        attachments: attachments || null,
        responsibleReviewEmployeeId: null,
        complaintStatus: "PENDING",
        finalDecision: null,
        orderId,
    });

    return complaint;
};

module.exports = {
    createComplaint,
};