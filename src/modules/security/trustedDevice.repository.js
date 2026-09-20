const prisma = require("../../config/prisma");

const createTrustedDevice = async (data) => {
    return await prisma.trustedDevice.create({
        data,
    });
};

const findTrustedDevice = async ({
    userType,
    userId,
    deviceType,
    operatingSystem,
    ipAddress,
}) => {
    return await prisma.trustedDevice.findFirst({
        where: {
            userType,
            userId,
            deviceType,
            operatingSystem,
            ipAddress,
            trusted: true,
        },
    });
};

const updateLastUsedAt = async (id) => {
    return await prisma.trustedDevice.update({
        where: {
            id,
        },
        data: {
            lastUsedAt: new Date(),
        },
    });
};

const getAllTrustedDevices = async (userType, userId) => {
    return await prisma.trustedDevice.findMany({
        where: {
            userType,
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

module.exports = {
    createTrustedDevice,
    findTrustedDevice,
    updateLastUsedAt,
    getAllTrustedDevices,
};