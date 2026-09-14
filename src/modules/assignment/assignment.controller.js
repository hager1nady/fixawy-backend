const assignmentService = require("./assignment.service");

const acceptAssignment = async (req, res) => {
    try {
        const result = await assignmentService.acceptAssignment(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            message: "Assignment accepted successfully",
            assignment: result.assignment,
            order: result.order,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

const rejectAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.rejectAssignment(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            message: "Assignment rejected successfully",
            assignment,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    acceptAssignment,
    rejectAssignment,
};