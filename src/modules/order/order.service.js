
const { randomUUID } = require("crypto");
const orderRepository = require("./order.repository");
const storageService = require("../../services/storage.service");

const createOrder = async (orderData, user, files) => {
    if (user.role !== "client") {
        throw new Error("Only clients can create orders");
    }

    const { problemDescription, serviceLocation, serviceId } = orderData;

    if (!problemDescription) {
        throw new Error("Problem description is required");
    }

    if (!serviceLocation) {
        throw new Error("Service location is required");
    }

    if (!serviceId) {
        throw new Error("Service ID is required");
    }

    const problemImage = files?.problemImage?.[0] || null;
    const problemVideo = files?.problemVideo?.[0] || null;

    if (!problemImage && !problemVideo) {
        throw new Error("Problem image or video is required");
    }

    const service = await orderRepository.findServiceById(serviceId);

    if (!service) {
        throw new Error("Service not found");
    }

    let problemImagePath = null;

    if (problemImage) {
        problemImagePath = await storageService.uploadFile(
            problemImage,
            "order-media",
            "problem-images"
        );
    }

    let problemVideoPath = null;

    if (problemVideo) {
        problemVideoPath = await storageService.uploadFile(
            problemVideo,
            "order-media",
            "problem-videos"
        );
    }

    // Generate a unique ID and order code
    const orderId = randomUUID();
    const orderCode = `ORD-${orderId.replace(/-/g, "").slice(0, 12).toUpperCase()}`;

    const orderDataToCreate = {
        id: orderId,
        orderCode,
        problemDescription,
        problemImage: problemImagePath,
        problemVideo: problemVideoPath,
        serviceLocation,
        clientId: user.id,
        serviceId,
        status: "NEW",
    };

    const order = await orderRepository.createOrder(orderDataToCreate);

    const workArea = serviceLocation.split(",")[0].trim();

    let technician = null;

    if (orderData.technicianId) {
        technician = await orderRepository.findTechnicianById(
            orderData.technicianId
        );

        if (!technician) {
            throw new Error("Selected technician not found");
        }

        if (technician.accountStatus !== "ACTIVE") {
            throw new Error("Selected technician is not active");
        }

        if (technician.specialty !== service.subcategory) {
            throw new Error(
                "Selected technician does not match the service specialty"
            );
        }

        if (technician.workArea !== workArea) {
            throw new Error(
                "Selected technician does not serve this location"
            );
        }
    } else {
        technician = await orderRepository.findSuitableTechnician(
            service.subcategory,
            workArea
        );
    }

    let assignment = null;

    if (technician) {
        assignment = await orderRepository.createAssignment(
            order.id,
            technician.id
        );
    }

    return {
        order,
        assignment,
    };
};

const markOrderAsArrived = async (orderId, user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can mark arrival");
    }

    const order = await orderRepository.findOrderForTechnician(
        orderId,
        user.id
    );

    if (!order) {
        throw new Error(
            "Order not found or you are not assigned to this order"
        );
    }

    if (order.status !== "ONGOING") {
        throw new Error(
            "Order must be ongoing before technician arrival"
        );
    }

    if (order.arrivalTime) {
        throw new Error("Technician arrival is already recorded");
    }

    return await orderRepository.markOrderAsArrived(orderId);
};

const markOrderAsCompleted = async (orderId, user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can complete orders");
    }

    const order = await orderRepository.findOrderForTechnician(
        orderId,
        user.id
    );

    if (!order) {
        throw new Error(
            "Order not found or you are not assigned to this order"
        );
    }

    if (order.status !== "ONGOING") {
        throw new Error("Order must be ongoing before completion");
    }

    if (!order.arrivalTime) {
        throw new Error(
            "Technician arrival must be recorded before completing the order"
        );
    }

    if (order.completionTime) {
        throw new Error("Order is already completed");
    }

    return await orderRepository.markOrderAsCompleted(orderId);
};

const cancelOrder = async (orderId, user, cancellationReason) => {
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error("Only clients or technicians can cancel orders");
    }

    if (!cancellationReason || !cancellationReason.trim()) {
        throw new Error("Cancellation reason is required");
    }

    const order = await orderRepository.findOrderForCancellation(
        orderId,
        user
    );

    if (!order) {
        throw new Error(
            "Order not found or you are not authorized to cancel this order"
        );
    }

    if (order.status === "COMPLETED") {
        throw new Error("Completed orders cannot be cancelled");
    }

    if (order.status === "CANCELLED") {
        throw new Error("Order is already cancelled");
    }

    return await orderRepository.cancelOrder(
        orderId,
        cancellationReason.trim()
    );
};

const getClientOrders = async (user) => {
    if (user.role !== "client") {
        throw new Error("Only clients can view their orders");
    }

    return await orderRepository.findOrdersForClient(user.id);
};

const getTechnicianOrders = async (user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can view their orders");
    }

    return await orderRepository.findOrdersForTechnician(user.id);
};

const getOrderDetails = async (orderId, user) => {
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error("Only clients and technicians can view order details");
    }

    const order = await orderRepository.findOrderDetails(orderId, user);

    if (!order) {
        throw new Error(
            "Order not found or you are not authorized to view it"
        );
    }

    return order;
};

const getOrderByCode = async (orderCode, user) => {
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error(
            "Only clients and technicians can search for orders"
        );
    }

    if (!orderCode || !orderCode.trim()) {
        throw new Error("Order code is required");
    }

    const order = await orderRepository.findOrderByCode(
        orderCode.trim(),
        user
    );

    if (!order) {
        throw new Error(
            "Order not found or you are not authorized to view it"
        );
    }

    return order;
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
