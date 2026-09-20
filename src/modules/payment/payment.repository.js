const prisma = require("../../config/prisma");

const findCompletedOrderForPayment = async (orderId) => {
    return await prisma.order.findFirst({
        where: {
            id: orderId,
            status: "COMPLETED",
        },
        include: {
            client: true,
            service: true,
            assignments: {
                where: {
                    status: "ACCEPTED",
                },
                include: {
                    technician: true,
                },
            },
        },
    });
};

const countClientOrders = async (clientId) => {
    return await prisma.order.count({
        where: {
            clientId,
        },
    });
};

const findPaymentByOrderId = async (orderId) => {
    return await prisma.payment.findFirst({
        where: {
            orderId,
        },
    });
};

const createPayment = async (paymentData) => {
    return await prisma.payment.create({
        data: paymentData,
    });
};

module.exports = {
    findCompletedOrderForPayment,
    countClientOrders,
    findPaymentByOrderId,
    createPayment,
};