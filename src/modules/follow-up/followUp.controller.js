const followUpService = require("./followUp.service");

const createFollowUp = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { scheduledAt } = req.body;

        if (!scheduledAt) {
            return res.status(400).json({
                message: "Scheduled time is required",
            });
        }

        const followUp = await followUpService.createFollowUp(
            orderId,
            new Date(scheduledAt)
        );

        return res.status(201).json({
            message: "Follow-up created successfully",
            data: followUp,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createFollowUp,
};