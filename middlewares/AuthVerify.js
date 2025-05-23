const jwt = require('jsonwebtoken');

require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY

module.exports= (req, res, next) => {
    const token = req.headers['token']
        
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error)
            res.status(403).send({ message: error })
                
        req._id = decoded.uid
        req.role= decoded.role
        next()
    })
}