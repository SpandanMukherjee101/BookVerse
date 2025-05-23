module.exports = (req, res, next) => {
    if (req.role)
        next()
    else
        res.status(403).send({ message: "Not Admin" })
}