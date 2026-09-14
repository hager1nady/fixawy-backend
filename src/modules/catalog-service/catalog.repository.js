const prisma = require("../../config/prisma");

const createService = async (serviceData) => {
  return await prisma.catalogService.create({
    data: serviceData,
  });
};

const getAllServices = async () => {
  return await prisma.catalogService.findMany({
    orderBy: {
      serviceName: "asc",
    },
  });
};

const getServiceById = async (id) => {
  return await prisma.catalogService.findUnique({
    where: { id },
  });
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
};