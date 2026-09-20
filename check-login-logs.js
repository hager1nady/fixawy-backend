const prisma = require("./src/config/prisma");

async function checkLoginLogs() {
    try {
        const logs = await prisma.loginLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        });

        console.log(JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLoginLogs();