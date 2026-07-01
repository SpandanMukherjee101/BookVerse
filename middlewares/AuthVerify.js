const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  if (!SECRET_KEY) {
    return res.status(500).json({ message: "Auth configuration is missing" });
  }

  const authHeader = req.headers.authorization || req.headers.token;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req._id = decoded.uid;
    req.role = decoded.role;
    next();
  });
};