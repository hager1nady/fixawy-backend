const callRecordRepository = require("./callRecord.repository");

const createCallRecord = async (data) => {
    const allowedDepartments = [
        "SUPPORT",
        "COMPLAINTS",
        "FINANCE",
        "TECHNICAL",
    ];

    if (
        data.department &&
        !allowedDepartments.includes(data.department)
    ) {
        throw new Error(
            "Invalid department. Allowed departments: SUPPORT, COMPLAINTS, FINANCE, TECHNICAL"
        );
    }

    return await callRecordRepository.createCallRecord(data);
};

const getCallRecordById = async (id) => {
    const callRecord =
        await callRecordRepository.findCallRecordById(id);

    if (!callRecord) {
        throw new Error("Call record not found");
    }

    return callRecord;
};

const getAllCallRecords = async () => {
    return await callRecordRepository.getAllCallRecords();
};

module.exports = {
    createCallRecord,
    getCallRecordById,
    getAllCallRecords,
};