const callRecordRepository = require("./callRecord.repository");
const storageService = require("../../services/storage.service");
const callRoutingService = require("./callRouting.service");

const createCallRecord = async (data, recordingFile) => {
    const routing = callRoutingService.routeCall(data.department);

    if (!recordingFile) {
        throw new Error("Call recording is required");
    }

    if (data.callType === "FOLLOW_UP") {
        if (!data.orderId) {
            throw new Error(
                "Order ID is required for follow-up calls"
            );
        }

        const order =
            await callRecordRepository.findOrderById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status !== "COMPLETED") {
            throw new Error(
                "Follow-up call can only be created for completed orders"
            );
        }
    }

    const recordingPath = await storageService.uploadFile(
        recordingFile,
        "call-recordings",
        "recordings"
    );

    return await callRecordRepository.createCallRecord({
        ...data,

        department: routing.department,

        durationSeconds: data.durationSeconds
            ? Number(data.durationSeconds)
            : null,

        startedAt: new Date(data.startedAt),

        endedAt: data.endedAt
            ? new Date(data.endedAt)
            : null,

        recordingUrl: recordingPath,
    });
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