const mongoose = require("mongoose");
const reviews = require("../models/ReviewModel.js");

class reviewController {
  async post(req, res) {
    try {
      const { rating, review } = req.body || {};
      const bookId = req.params.id;

      if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).json({ message: "Invalid book id" });
      }

      if (!rating || !review) {
        return res.status(400).json({ message: "Rating and review are required" });
      }

      const reviewData = {
        userId: req._id,
        bookId,
        rating: Number(rating),
        review: String(review).trim(),
      };

      const newReview = await reviews.create(reviewData);
      return res.status(201).json(newReview);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create review" });
    }
  }

  async get(req, res) {
    try {
      const bookId = req.params.id;

      if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).json({ message: "Invalid book id" });
      }

      const review = await reviews.find({ bookId }).populate("userId", "name email").populate("bookId", "title author");
      return res.json(review);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  }
}

module.exports = new reviewController();