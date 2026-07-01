const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserModel = require("../models/UserModel.js");

const SECRET_KEY = process.env.SECRET_KEY;

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  admin: user.admin,
});

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body || {};

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const trimmedName = String(name).trim();

      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      if (!SECRET_KEY) {
        return res.status(500).json({ message: "Auth configuration is missing" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
      });

      const token = jwt.sign({ uid: newUser._id, role: newUser.admin }, SECRET_KEY, { expiresIn: "24h" });
      return res.status(201).json({ token, user: buildUserResponse(newUser) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to register user" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (!SECRET_KEY) {
        return res.status(500).json({ message: "Auth configuration is missing" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await UserModel.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ uid: user._id, role: user.admin }, SECRET_KEY, { expiresIn: "24h" });
      return res.status(200).json({ token, user: buildUserResponse(user) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to login user" });
    }
  }
}

module.exports = new UserController();