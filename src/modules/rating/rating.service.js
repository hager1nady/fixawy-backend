const ratingRepository = require("./rating.repository");

const createRating = async (orderId, user, ratingData) => {
    if (user.role !== "client" && user.role !== "technician") {
        throw new Error("Only clients or technicians can submit ratings");
    }

    const { rating, comment, images } = ratingData;

    // Validate rating
    if (rating === undefined || rating === null) {
        throw new Error("Rating is required");
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
    }

    // Get completed order
    const order = await ratingRepository.findCompletedOrder(orderId);

    if (!order) {
        throw new Error("Completed order not found");
    }

    // Payment must be completed before rating
    if (!order.payments || order.payments.length === 0) {
        throw new Error("Payment must be completed before submitting a rating");
    }

    // Make sure the order has an accepted technician
    const assignment = order.assignments[0];

    if (!assignment) {
        throw new Error("No accepted technician found for this order");
    }

    let ratedType;
    let ratedId;

    if (user.role === "client") {
        // Client can only rate their own order
        if (order.clientId !== user.id) {
            throw new Error("You are not authorized to rate this order");
        }

        ratedType = "technician";
        ratedId = assignment.technicianId;
    } else {
        // Technician can only rate the technician assigned to the order
        if (assignment.technicianId !== user.id) {
            throw new Error("You are not authorized to rate this order");
        }

        ratedType = "client";
        ratedId = order.clientId;
    }

    // Prevent duplicate rating by same user for same order
    const existingRating = await ratingRepository.findExistingRating(
        orderId,
        user.id
    );

    if (existingRating) {
        throw new Error("You have already rated this order");
    }

    const ratingRecord = await ratingRepository.createRating({
        rating: Number(rating),
        comment: comment || null,
        images: images || null,
        raterType: user.role,
        raterId: user.id,
        ratedType,
        ratedId,
        orderId,
    });

    // Update technician average rating
    if (ratedType === "technician") {
        const technicianRatings =
            await ratingRepository.getTechnicianRatings(ratedId);

        const total = technicianRatings.reduce(
            (sum, item) => sum + item.rating,
            0
        );

        const averageRating =
            technicianRatings.length > 0
                ? Number((total / technicianRatings.length).toFixed(2))
                : 0;

        await ratingRepository.updateTechnicianRating(
            ratedId,
            averageRating
        );
    }

    return ratingRecord;
};

module.exports = {
    createRating,
};