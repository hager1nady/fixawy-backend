
const assignmentService = require("./assignment.service");

const acceptAssignment = async (req, res) => {
    try {
        const result = await assignmentService.acceptAssignment(
            req.params.id,
            req.user
        );

        const io = req.app.get("io");

        if (io && result.order) {
            io.to(`order:${result.order.id}`).emit("orderUpdated", {
                orderId: result.order.id,
                status: result.order.status,
                assignmentStatus: result.assignment.status,
                message: "The technician accepted the order",
            });
        }

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
        const result = await assignmentService.rejectAssignment(
            req.params.id,
            req.user
        );

        const io = req.app.get("io");

        // Notify users in the order room.
        if (io && result.orderId) {
            io.to(`order:${result.orderId}`).emit("orderUpdated", {
                orderId: result.orderId,
                assignmentStatus: "REJECTED",
                reassigned: result.reassigned ?? false,
                needsCallCenter: result.needsCallCenter ?? false,
                message: result.message,
                newAssignment: result.assignment ?? null,
            });
        }

        // Remove the rejected technician from the order room.
        const removeTechnicianFromOrderRoom =
            req.app.get("removeTechnicianFromOrderRoom");

        if (removeTechnicianFromOrderRoom && result.orderId) {
            await removeTechnicianFromOrderRoom(
                req.user.id,
                result.orderId
            );
        }

        return res.status(200).json(result);
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
