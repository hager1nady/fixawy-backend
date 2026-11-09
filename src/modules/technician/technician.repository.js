
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

// Search active technicians by specialty and/or work area
const findAvailableTechnicians = async ({ specialty, profession, workArea }) => {
    const where = {
        accountStatus: "ACTIVE",
    };

    if (specialty) {
        where.specialty = {
            contains: specialty,
            mode: "insensitive",
        };
    }

    if (profession) {
        where.profession = {
            contains: profession,
            mode: "insensitive",
        };
    }

    if (workArea) {
        where.workArea = {
            contains: workArea,
            mode: "insensitive",
        };
    }

    return prisma.technician.findMany({
        where,
        select: {
            id: true,
            fullName: true,
            profession: true,
            specialty: true,
            workArea: true,
            currentLocation: true,
            yearsOfExperience: true,
            averageRating: true,
            accountStatus: true,
        },
        orderBy: [
            { averageRating: "desc" },
            { yearsOfExperience: "desc" },
        ],
    });
};

module.exports = {
    findByMobileNumber,
    createTechnician,
    findAvailableTechnicians,
};
