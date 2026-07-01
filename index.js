const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const Routes = require("./routes/Routes.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api", Routes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "BookVerse API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const connectToDatabase = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);
};

if (require.main === module) {
  connectToDatabase()
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Port connected at ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;