const complaintService = require("./complaint.service");

const createComplaint = async (req, res) => {
    try {
        const complaint = await complaintService.createComplaint(
            req.params.orderId,
            req.user,
            req.body
        );

        return res.status(201).json({
            message: "Complaint submitted successfully",
            complaint,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createComplaint,
};