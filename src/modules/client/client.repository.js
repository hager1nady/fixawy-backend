const prisma = require("../../config/prisma");

const findByMobileNumber = async (mobileNumber) => {
    return prisma.client.findUnique({
        where: {
            mobileNumber,
        },
    });
};

const createClient = async (data) => {
    return prisma.client.create({
        data,
    });
};

module.exports = {
    findByMobileNumber,
    createClient,
};