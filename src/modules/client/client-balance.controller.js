const clientBalanceService = require("./client-balance.service");

const getMyBalance = async (req, res) => {
    try {
        const balance = await clientBalanceService.getClientBalance(
            req.user.id
        );

        return res.status(200).json({
            message: "Client balance retrieved successfully",
            data: balance,
        });
    } catch (error) {
        console.error("Get client balance error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getMyBalance,
};