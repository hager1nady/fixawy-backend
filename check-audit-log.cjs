const prisma = require("./src/config/prisma");

const checkAuditLogs = async () => {
    try {
        const logs = await prisma.auditLog.findMany({
            where: {
                targetType: "TECHNICIAN",
                targetId: "427265ab-5c0c-4580-b57b-f890a586d92b",
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log(JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error("Audit Log Check Error:", error);
    } finally {
        await prisma.$disconnect();
    }
};

checkAuditLogs();