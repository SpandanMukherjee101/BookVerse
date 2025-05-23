const books = require("../models/BookModel.js")

class BookController {
    async post(req, res) {
        try {
            const bookData={
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                genre: req.body.genre,
                published: req.body.published
            }

            const newBook= await books.create(bookData)
            res.json(newBook)
        }
        catch (e) {
            res.status(500).send(e)
        }
    }

    async list(req, res) {
        try {
            const page = parseInt(req.query.pg) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const titles= []

            const bookList = await books.find().skip(skip).limit(limit)
            bookList.forEach(book=> {
                titles.push(book.title)
            });

            res.json({titles: titles})

        } catch (e) {
            res.status(500).send(e)
        }
    }

    async get(req, res) {
        try {
            const bookId = req.params.id
            
            try {
                const bookData = await books.findOne({ _id: bookId })                
                if (bookData)
                    res.json(bookData)
            } catch (e) {
                res.status(404).send(e)
            }
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = new BookController()