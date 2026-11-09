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

        const io = req.app.get("io");

        if (io && order) {
            io.to(`order:${order.id}`).emit("orderUpdated", {
                orderId: order.id,
                status: order.status,
                arrivalTime: order.arrivalTime,
                message: "The technician has arrived",
            });
        }

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

        const io = req.app.get("io");

        if (io && order) {
            io.to(`order:${order.id}`).emit("orderUpdated", {
                orderId: order.id,
                status: order.status,
                completionTime: order.completionTime,
                message: "The order has been completed",
            });
        }

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

        const io = req.app.get("io");

        if (io && order) {
            io.to(`order:${order.id}`).emit("orderUpdated", {
                orderId: order.id,
                status: order.status,
                cancellationReason: order.cancellationReason,
                message: "The order has been cancelled",
            });
        }

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



const getClientOrders = async (req, res) => {
    try {
        const orders = await orderService.getClientOrders(req.user);

        return res.status(200).json({
            message: "Client orders retrieved successfully",
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error(error);

        return res.status(403).json({
            message: error.message,
        });
    }
};


const getTechnicianOrders = async (req, res) => {
    try {
        const orders = await orderService.getTechnicianOrders(req.user);

        return res.status(200).json({
            message: "Technician orders retrieved successfully",
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error(error);

        return res.status(403).json({
            message: error.message,
        });
    }
};


const getOrderDetails = async (req, res) => {
    try {
        const order = await orderService.getOrderDetails(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            message: "Order details retrieved successfully",
            order,
        });
    } catch (error) {
        console.error(error);

        const statusCode =
            error.message.includes("not found") ||
                error.message.includes("not authorized")
                ? 404
                : error.message.includes("Only clients and technicians")
                    ? 403
                    : 400;

        return res.status(statusCode).json({
            message: error.message,
        });
    }
};


const getOrderByCode = async (req, res) => {
    try {
        const order = await orderService.getOrderByCode(
            req.params.orderCode,
            req.user
        );

        return res.status(200).json({
            message: "Order retrieved successfully",
            order,
        });
    } catch (error) {
        console.error(error);

        const statusCode =
            error.message.includes("not found") ||
            error.message.includes("not authorized")
                ? 404
                : error.message.includes("Only clients and technicians")
                    ? 403
                    : 400;

        return res.status(statusCode).json({
            message: error.message,
        });
    }
};


module.exports = {
    createOrder,
    markOrderAsArrived,
    markOrderAsCompleted,
    cancelOrder,
    getClientOrders,
    getTechnicianOrders,
    getOrderDetails,
    getOrderByCode,
};