
const clientService = require("./client.service");

const registerClient = async (req, res) => {
    try {
        const result = await clientService.registerClient(
            req.body,
            req.file
        );

        res.status(201).json({
            message: "Client account created successfully",
            token: result.token,
            client: result.client,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

const loginClient = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        const result = await clientService.loginClient(
            mobileNumber,
            password
        );

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            client: result.client,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerClient,
    loginClient,
};