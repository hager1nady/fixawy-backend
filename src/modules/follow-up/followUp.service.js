const followUpRepository = require("./followUp.repository");

const createFollowUp = async (orderId, scheduledAt) => {
    // Check that the order exists
    const order = await followUpRepository.findOrderById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    // Follow-up is only allowed for completed orders
    if (order.status !== "COMPLETED") {
        throw new Error(
            "Follow-up can only be created for completed orders"
        );
    }

    // Check if a follow-up already exists
    const existingFollowUp =
        await followUpRepository.findFollowUpByOrderId(orderId);

    if (existingFollowUp) {
        throw new Error("Follow-up already exists for this order");
    }

    return await followUpRepository.createFollowUp({
        orderId,
        scheduledAt,
        status: "PENDING",
    });
};

const completeFollowUp = async (
    orderId,
    completedAt,
    customerSatisfied,
    notes
) => {
    const existingFollowUp =
        await followUpRepository.findFollowUpByOrderId(orderId);

    if (!existingFollowUp) {
        throw new Error("Follow-up not found");
    }

    return await followUpRepository.updateFollowUp(
        existingFollowUp.id,
        {
            completedAt,
            status: "COMPLETED",
            customerSatisfied,
            notes,
        }
    );
};

module.exports = {
    createFollowUp,
    completeFollowUp,
};