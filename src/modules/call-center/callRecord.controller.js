const callRecordService = require("./callRecord.service");

const createCallRecord = async (req, res) => {
    try {
        const callRecord =
        await callRecordService.createCallRecord(
            req.body,
            req.file
        );

        return res.status(201).json({
            message: "Call record created successfully",
            data: callRecord,
        });
    } catch (error) {
        console.error("Create call record error:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

const getCallRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const callRecord =
            await callRecordService.getCallRecordById(id);

        return res.status(200).json({
            message: "Call record retrieved successfully",
            data: callRecord,
        });
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};

const getAllCallRecords = async (req, res) => {
    try {
        const callRecords =
            await callRecordService.getAllCallRecords();

        return res.status(200).json({
            message: "Call records retrieved successfully",
            data: callRecords,
        });
    } catch (error) {
        console.error("Get call records error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    createCallRecord,
    getCallRecordById,
    getAllCallRecords,
};