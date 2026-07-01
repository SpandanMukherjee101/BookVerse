const mongoose = require("mongoose");
const books = require("../models/BookModel.js");

class BookController {
  async post(req, res) {
    try {
      const { title, author, description, genre, published } = req.body || {};

      if (!title || !author || !description || !genre || published === undefined) {
        return res.status(400).json({ message: "Title, author, description, genre, and published are required" });
      }

      if (!Array.isArray(genre) || genre.length === 0) {
        return res.status(400).json({ message: "Genre must be a non-empty array" });
      }

      const bookData = {
        title: String(title).trim(),
        author: String(author).trim(),
        description: String(description).trim(),
        genre: genre.map((item) => String(item).trim()),
        published: Number(published),
      };

      const newBook = await books.create(bookData);
      return res.status(201).json(newBook);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create book" });
    }
  }

  async list(req, res) {
    try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
      const skip = (page - 1) * limit;

      const [bookList, totalBooks] = await Promise.all([
        books.find().skip(skip).limit(limit),
        books.countDocuments(),
      ]);

      return res.json({
        titles: bookList.map((book) => book.title),
        page,
        limit,
        totalBooks,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch books" });
    }
  }

  async get(req, res) {
    try {
      const bookId = req.params.id;

      if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).json({ message: "Invalid book id" });
      }

      const bookData = await books.findById(bookId);
      if (!bookData) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.json(bookData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch book" });
    }
  }
}

module.exports = new BookController();