const bcrypt = require('bcrypt');
const UserModel = require("../models/UserModel.js")

const jwt = require('jsonwebtoken')

require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY

class UserController {
    async register(req, res) {
        try {
            /*I have purposefully not kept the option of Admin since it can be easily modified in Atlas. And that way it's safer.*/
            const userdata = {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
            }
            let user = await UserModel.findOne({ email: userdata.email })
            if (user) res.status(409).send({ data: "User exists already!" })
            const newUser = await UserModel.create(userdata)
            const token = jwt.sign({ uid: newUser._id, role: newUser.admin }, SECRET_KEY, { expiresIn: '900000h' })
            res.json(token)
        }
        catch (e) {
            res.status(500).send(e)
        }
    }

    async login(req, res) {
        try {
            const userdata = {
                email: req.body.email,
                password: req.body.password,
            }

            try {
                const user = await UserModel.findOne({ email: userdata.email })
                let b = await bcrypt.compare(userdata.password, user.password)
                if (b) {
                    const token = jwt.sign({ uid: user._id, role: user.admin }, SECRET_KEY, { expiresIn: '900000h' })
                    res.json(token)
                }
                else res.status(401).send("Wrong Password!!!")
            } catch (err) {
                res.status(404).send("User not found!!!")
            }
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = new UserController()