
const app = require("./app");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const prisma = require("./config/prisma");

const PORT = 8080;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});

// Verify the user's JWT before allowing a Socket.IO connection.
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(
                new Error("Authentication token is required")
            );
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = user;

        next();
    } catch (error) {
        next(new Error("Invalid or expired token"));
    }
});

// Remove all of a technician's active sockets from an order room.
const removeTechnicianFromOrderRoom = async (
    technicianId,
    orderId
) => {
    const roomName = `order:${orderId}`;
    const sockets = await io.fetchSockets();

    for (const clientSocket of sockets) {
        if (
            clientSocket.user?.role === "technician" &&
            clientSocket.user?.id === technicianId
        ) {
            await clientSocket.leave(roomName);
        }
    }
};

io.on("connection", (socket) => {
    console.log("Authenticated socket connected:", socket.id);

    socket.on("joinOrder", async (orderId, callback) => {
        try {
            if (
                typeof orderId !== "string" ||
                !orderId.trim()
            ) {
                return callback?.({
                    success: false,
                    message: "Invalid order ID",
                });
            }

            let authorizedOrder = null;

            // Allow the client who owns the order.
            if (socket.user.role === "client") {
                authorizedOrder = await prisma.order.findFirst({
                    where: {
                        id: orderId,
                        clientId: socket.user.id,
                    },
                    select: {
                        id: true,
                    },
                });
            }

            // Allow a technician currently assigned to the order.
            else if (socket.user.role === "technician") {
                const assignment =
                    await prisma.assignment.findFirst({
                        where: {
                            orderId: orderId,
                            technicianId: socket.user.id,
                            status: {
                                in: ["PENDING", "ACCEPTED"],
                            },
                        },
                        select: {
                            id: true,
                            orderId: true,
                        },
                    });

                if (assignment) {
                    authorizedOrder = {
                        id: assignment.orderId,
                    };
                }
            }

            if (!authorizedOrder) {
                return callback?.({
                    success: false,
                    message:
                        "You are not authorized to join this order",
                });
            }

            await socket.join(
                `order:${authorizedOrder.id}`
            );

            console.log(
                `Socket ${socket.id} joined order:${authorizedOrder.id}`
            );

            return callback?.({
                success: true,
                message: "Joined order room successfully",
            });
        } catch (error) {
            console.error(
                "joinOrder error:",
                error.message
            );

            return callback?.({
                success: false,
                message: "Failed to join order room",
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

app.set("io", io);

// Expose the helper to the application so controllers can call it.
app.set(
    "removeTechnicianFromOrderRoom",
    removeTechnicianFromOrderRoom
);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
