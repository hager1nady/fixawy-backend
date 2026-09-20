const trustedDeviceRepository = require("./trustedDevice.repository");

const registerOrUpdateDevice = async ({
    userType,
    userId,
    deviceType,
    operatingSystem,
    ipAddress,
}) => {
    const existingDevice =
        await trustedDeviceRepository.findTrustedDevice({
            userType,
            userId,
            deviceType,
            operatingSystem,
            ipAddress,
        });

    if (existingDevice) {
        return await trustedDeviceRepository.updateLastUsedAt(
            existingDevice.id
        );
    }

    return await trustedDeviceRepository.createTrustedDevice({
        userType,
        userId,
        deviceType,
        operatingSystem,
        ipAddress,
        trusted: true,
        lastUsedAt: new Date(),
    });
};

const getUserTrustedDevices = async (userType, userId) => {
    return await trustedDeviceRepository.getAllTrustedDevices(
        userType,
        userId
    );
};

module.exports = {
    registerOrUpdateDevice,
    getUserTrustedDevices,
};