const reviews = require("../models/ReviewModel.js")

class reviewController {
    async post(req, res) {
        try {            
            const reviewData={
                userId: req._id,
                bookId: req.params.id,
                rating: req.body.rating,
                review: req.body.review
            }

            const newReview= await reviews.create(reviewData)
            res.json(newReview)
        }
        catch (e) {
            res.status(500).send(e)
        }
    }

    async get(req, res) {
        try {
            const bookId = req.params.id
            try {
                const review= await reviews.find({bookId: bookId}).populate('userId').populate('bookId')
                res.json(review)
            } catch (e) {
                res.status(404).send(e)
            }
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = new reviewController()