const paymentService = require("./payment.service");

const calculatePayment = async (req, res) => {
    try {
        const result = await paymentService.calculatePayment(req.params.orderId);

        return res.status(200).json({
            message: "Payment calculation completed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const createPayment = async (req, res) => {
    try {
        const result = await paymentService.createPayment(
            req.params.orderId,
            req.user,
            req.body
        );

        return res.status(201).json({
            message: "Payment created successfully",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    calculatePayment,
    createPayment,
};