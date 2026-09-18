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
const completeFollowUp = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { completedAt, customerSatisfied, notes } = req.body;

        if (!completedAt) {
            return res.status(400).json({
                message: "Completed time is required",
            });
        }

        if (customerSatisfied === undefined) {
            return res.status(400).json({
                message: "Customer satisfaction is required",
            });
        }

        const followUp = await followUpService.completeFollowUp(
            orderId,
            new Date(completedAt),
            customerSatisfied,
            notes
        );

        return res.status(200).json({
            message: "Follow-up completed successfully",
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
    completeFollowUp
};