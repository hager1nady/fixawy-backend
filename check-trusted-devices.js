const prisma = require("./src/config/prisma");

async function checkTrustedDevices() {
    try {
        const devices = await prisma.trustedDevice.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        });

        console.log(JSON.stringify(devices, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTrustedDevices();