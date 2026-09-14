const catalogRepository = require("./catalog.repository");

const createService = async (serviceData) => {
  const {
    serviceName,
    mainCategory,
    subcategory,
    serviceDescription,
  } = serviceData;

  if (!serviceName) {
    throw new Error("Service name is required");
  }

  if (!mainCategory) {
    throw new Error("Main category is required");
  }

  if (!subcategory) {
    throw new Error("Subcategory is required");
  }

  if (!serviceDescription) {
    throw new Error("Service description is required");
  }

  return await catalogRepository.createService(serviceData);
};

const getAllServices = async () => {
  return await catalogRepository.getAllServices();
};

const getServiceById = async (id) => {
  const service = await catalogRepository.getServiceById(id);

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
};