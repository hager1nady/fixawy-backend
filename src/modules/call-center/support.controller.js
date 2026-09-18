const supportService = require("./support.service");

const getSupportMessage = async (req, res) => {
    try {
        const supportMessage =
            supportService.createSupportMessage();

        return res.status(200).json({
            message: "Support message retrieved successfully",
            data: supportMessage,
        });
    } catch (error) {
        console.error("Get support message error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getSupportMessage,
};