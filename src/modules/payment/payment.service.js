const paymentRepository = require("./payment.repository");
const { encrypt, hash } = require("../../utils/encryption");

const ALLOWED_PAYMENT_METHODS = [
    "BANK_TRANSFER",
    "FAWRY",
    "INSTAPAY",
    "VODAFONE_CASH",
    "ETISALAT_CASH",
    "ORANGE_CASH",
];

const calculatePayment = async (orderId) => {
    const order = await paymentRepository.findCompletedOrderForPayment(orderId);

    if (!order) {
        throw new Error("Completed order not found");
    }

    if (!order.service.initialPrice) {
        throw new Error("Service price is not configured");
    }

    const technicianAssignment = order.assignments[0];

    if (!technicianAssignment) {
        throw new Error("No accepted technician found for this order");
    }

    const technician = technicianAssignment.technician;

    // Check if this is the client's first order
    const clientOrderCount = await paymentRepository.countClientOrders(
        order.clientId
    );

    const isFirstOrder = clientOrderCount === 1;

    const originalServiceValue = order.service.initialPrice;

    // 50% discount for the first order
    const serviceValue = isFirstOrder
        ? originalServiceValue * 0.5
        : originalServiceValue;

    // Commission based on technician's configured percentage
    const commission =
        serviceValue * (technician.commissionPercentage / 100);

    const technicianEarnings = serviceValue - commission;

    return {
        orderId: order.id,
        originalServiceValue,
        serviceValue,
        isFirstOrder,
        discountPercentage: isFirstOrder ? 50 : 0,
        commission,
        technicianEarnings,
        commissionPercentage: technician.commissionPercentage,
    };
};

const createPayment = async (orderId, user, paymentData) => {
    if (user.role !== "client") {
        throw new Error("Only clients can make payments");
    }

    const order = await paymentRepository.findCompletedOrderForPayment(orderId);

    if (!order) {
        throw new Error("Completed order not found");
    }

    if (order.clientId !== user.id) {
        throw new Error("You are not authorized to pay for this order");
    }

    const {
        paymentMethod,
        transactionId,
        referenceNumber,
    } = paymentData;

    if (!paymentMethod) {
        throw new Error("Payment method is required");
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
        throw new Error("Invalid payment method");
    }

    if (!transactionId) {
        throw new Error("Transaction ID is required");
    }

    const calculation = await calculatePayment(orderId);

    const payment = await paymentRepository.createPayment({
        transactionId: encrypt(transactionId),
        transactionIdHash: hash(transactionId),
        serviceValue: calculation.serviceValue,
        commission: calculation.commission,
        tax: null,
        technicianEarnings: calculation.technicianEarnings,
        paymentMethod,
        paymentStatus: "PENDING",
        referenceNumber: referenceNumber
            ? encrypt(referenceNumber)
            : null,
        orderId,
    });

    return {
        payment,
        calculation,
    };
};

module.exports = {
    calculatePayment,
    createPayment,
};