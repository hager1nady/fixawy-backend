
const { io } = require("socket.io-client");

const BASE_URL = "http://localhost:8080";

// Paste the technician's current JWT here.
const TOKEN = "PASTE_TECHNICIAN_TOKEN_HERE";

async function main() {
    if (
        !TOKEN ||
        TOKEN === "PASTE_TECHNICIAN_TOKEN_HERE"
    ) {
        throw new Error(
            "Please set the technician token in test-socket.js"
        );
    }

    // Get the technician's orders automatically.
    const response = await fetch(
        `${BASE_URL}/api/orders/technician-orders`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Could not fetch technician orders: ${
                data.message || response.status
            }`
        );
    }

    const orders = data.orders || [];

    // Select an order where this technician still has
    // a valid pending or accepted assignment.
    const order = orders.find((item) =>
        item.assignments?.some(
            (assignment) =>
                ["PENDING", "ACCEPTED"].includes(
                    assignment.status
                )
        )
    );

    if (!order) {
        throw new Error(
            "No order with a PENDING or ACCEPTED assignment was found."
        );
    }

    const ORDER_ID = order.id;

    console.log("Selected order:", ORDER_ID);
    console.log("Order status:", order.status);

    const socket = io(BASE_URL, {
        auth: { token: TOKEN },
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("Connected successfully!");

        socket.emit("joinOrder", ORDER_ID, (result) => {
            console.log("Join order response:", result);

            if (!result?.success) {
                console.log(
                    "Could not join order room:",
                    result?.message
                );
                socket.disconnect();
                return;
            }

            console.log("Waiting for order updates...");
        });
    });

    socket.on("orderUpdated", (update) => {
        console.log("Order update received:", update);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection failed:", error.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
    });
}

main().catch((error) => {
    console.error("Test failed:", error.message);
});
  