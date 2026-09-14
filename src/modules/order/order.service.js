const orderRepository = require("./order.repository");
const storageService = require("../../services/storage.service");

const createOrder = async (orderData, user, files) => {
    // 1. Only clients can create orders
    if (user.role !== "client") {
        throw new Error("Only clients can create orders");
    }

    const {
        problemDescription,
        serviceLocation,
        serviceId,
    } = orderData;

    // 2. Validate required fields
    if (!problemDescription) {
        throw new Error("Problem description is required");
    }

    if (!serviceLocation) {
        throw new Error("Service location is required");
    }

    if (!serviceId) {
        throw new Error("Service ID is required");
    }

    // 3. Get uploaded media
    const problemImage = files?.problemImage?.[0] || null;
    const problemVideo = files?.problemVideo?.[0] || null;

    // 4. At least one media file is required
    if (!problemImage && !problemVideo) {
        throw new Error("Problem image or video is required");
    }

    // 5. Check that service exists
    const service = await orderRepository.findServiceById(serviceId);

    if (!service) {
        throw new Error("Service not found");
    }

    // 6. Upload problem image
    let problemImagePath = null;

    if (problemImage) {
        problemImagePath = await storageService.uploadFile(
            problemImage,
            "order-media",
            "problem-images"
        );
    }

    // 7. Upload problem video
    let problemVideoPath = null;

    if (problemVideo) {
        problemVideoPath = await storageService.uploadFile(
            problemVideo,
            "order-media",
            "problem-videos"
        );
    }

    // 8. Create order
    const orderDataToCreate = {
        problemDescription,
        problemImage: problemImagePath,
        problemVideo: problemVideoPath,
        serviceLocation,
        clientId: user.id,
        serviceId,
        status: "NEW",
    };

    const order = await orderRepository.createOrder(
        orderDataToCreate
    );

    // 9. Extract city from service location
    // Example: "Minya, Egypt" -> "Minya"
    const workArea = serviceLocation.split(",")[0].trim();

    // 10. Find suitable technician
    const technician =
        await orderRepository.findSuitableTechnician(
            service.subcategory,
            workArea
        );

    // 11. Create assignment if technician is available
    let assignment = null;

    if (technician) {
        assignment = await orderRepository.createAssignment(
            order.id,
            technician.id
        );
    }

    // 12. Return order + assignment
    return {
        order,
        assignment,
    };
};

const markOrderAsArrived = async (orderId, user) => {
    if (user.role !== "technician") {
        throw new Error("Only technicians can mark arrival");
    }

    const order =
        await orderRepository.findOrderForTechnician(
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
    // Only clients and technicians can cancel orders
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error(
            "Only clients or technicians can cancel orders"
        );
    }

    // Cancellation reason is required
    if (!cancellationReason || !cancellationReason.trim()) {
        throw new Error("Cancellation reason is required");
    }

    // Check that the user is allowed to cancel this order
    const order = await orderRepository.findOrderForCancellation(
        orderId,
        user
    );

    if (!order) {
        throw new Error(
            "Order not found or you are not authorized to cancel it"
        );
    }

    // Completed orders cannot be cancelled
    if (order.status === "COMPLETED") {
        throw new Error("Completed orders cannot be cancelled");
    }

    // Already cancelled
    if (order.status === "CANCELLED") {
        throw new Error("Order is already cancelled");
    }

    // Only NEW and ONGOING orders can be cancelled
    if (order.status !== "NEW" && order.status !== "ONGOING") {
        throw new Error(
            "Order cannot be cancelled in its current status"
        );
    }

    return await orderRepository.cancelOrder(
        orderId,
        cancellationReason.trim()
    );
};

module.exports = {
    createOrder,
    markOrderAsArrived,
    markOrderAsCompleted,
    cancelOrder,
};