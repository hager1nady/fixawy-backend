const prisma = require("../../config/prisma");

const findBalanceByClientId = async (clientId) => {
    return await prisma.clientBalance.findUnique({
        where: {
            clientId,
        },
    });
};

const createBalance = async (clientId, balance = 0) => {
    return await prisma.clientBalance.create({
        data: {
            clientId,
            balance,
        },
    });
};

const updateBalance = async (clientId, balance) => {
    return await prisma.clientBalance.update({
        where: {
            clientId,
        },
        data: {
            balance,
        },
    });
};

module.exports = {
    findBalanceByClientId,
    createBalance,
    updateBalance,
};