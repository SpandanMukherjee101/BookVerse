module.exports = (req, res, next) => {
  if (req.role === true) {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
};