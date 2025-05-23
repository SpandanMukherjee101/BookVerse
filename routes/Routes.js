const user= require("../controllers/UserController.js")

const book= require("../controllers/BookController.js")
const review= require("../controllers/ReviewController.js")

const auth= require("../middlewares/AuthVerify.js")
const adVeri= require("../middlewares/AdminVerify.js")

const express= require("express")
let Routes= express()

Routes.post('/register', user.register)
Routes.post('/login', user.login)

Routes.post('/books', auth, adVeri, book.post)
Routes.get('/books/', book.list)
Routes.get('/books/:id', book.get)

Routes.post('/books/:id/reviews', auth, review.post)
Routes.get('/books/:id/reviews', review.get)

module.exports= Routes;