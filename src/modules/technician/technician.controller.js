const technicianService = require("./technician.service");

const registerTechnician = async (req, res) => {
    try {
        const result = await technicianService.registerTechnician(
            {
                fullName: req.body.fullName,
                mobileNumber: req.body.mobileNumber,
                password: req.body.password,
                profession: req.body.profession,
                yearsOfExperience: req.body.yearsOfExperience,
                workArea: req.body.workArea,
                workingHours: req.body.workingHours,
            },
            req.file
        );

        return res.status(201).json({
            message: "Technician account created successfully",
            token: result.token,
            technician: result.technician,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
const loginTechnician = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        const result = await technicianService.loginTechnician(
            mobileNumber,
            password
        );

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            technician: result.technician,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerTechnician,
    loginTechnician,
};