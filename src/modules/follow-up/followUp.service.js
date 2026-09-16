const followUpRepository = require("./followUp.repository");

const createFollowUp = async (orderId, scheduledAt) => {
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

module.exports = {
    createFollowUp,
};