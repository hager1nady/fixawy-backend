const catalogService = require("./catalog.service");

const createService = async (req, res) => {
  try {
    const service = await catalogService.createService(req.body);

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await catalogService.getAllServices();

    return res.status(200).json({
      services,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await catalogService.getServiceById(req.params.id);

    return res.status(200).json({
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
};