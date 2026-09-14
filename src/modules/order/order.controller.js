const orderService = require("./order.service");

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(
            req.body,
            req.user,
            req.files
        );

        return res.status(201).json({
            message: "Order created successfully",
            order: result.order,
            assignment: result.assignment,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

const markOrderAsArrived = async (req, res) => {
    try {
        const order = await orderService.markOrderAsArrived(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            message: "Technician arrival recorded successfully",
            order,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
const markOrderAsCompleted = async (req, res) => {
    try {
        const order = await orderService.markOrderAsCompleted(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            message: "Order completed successfully",
            order,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};
const cancelOrder = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const order = await orderService.cancelOrder(
            req.params.id,
            req.user,
            cancellationReason
        );

        return res.status(200).json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    markOrderAsArrived,
    markOrderAsCompleted,
    cancelOrder,

};