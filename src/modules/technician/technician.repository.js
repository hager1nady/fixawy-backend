const prisma = require("../../config/prisma");

const findByMobileNumber = async (mobileNumber) => {
    return prisma.technician.findUnique({
        where: {
            mobileNumber,
        },
    });
};

const createTechnician = async (data) => {
    return prisma.technician.create({
        data,
    });
};

module.exports = {
    findByMobileNumber,
    createTechnician,
};