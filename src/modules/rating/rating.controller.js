const ratingService = require("./rating.service");

const createRating = async (req, res) => {
    try {
        const rating = await ratingService.createRating(
            req.params.orderId,
            req.user,
            req.body
        );

        return res.status(201).json({
            message: "Rating submitted successfully",
            rating,
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createRating,
};