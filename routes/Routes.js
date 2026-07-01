const express = require("express");
const user = require("../controllers/UserController.js");
const book = require("../controllers/BookController.js");
const review = require("../controllers/ReviewController.js");
const auth = require("../middlewares/AuthVerify.js");
const adVeri = require("../middlewares/AdminVerify.js");

const router = express.Router();

router.post("/register", user.register);
router.post("/login", user.login);

router.post("/books", auth, adVeri, book.post);
router.get("/books", book.list);
router.get("/books/:id", book.get);

router.post("/books/:id/reviews", auth, review.post);
router.get("/books/:id/reviews", review.get);

module.exports = router;