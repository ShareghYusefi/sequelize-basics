const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // bcrypt is used to create a hashed password. Hashed password are more secure with a length of 60 characters.
    // hash takes in 2 arguments, the password to be hashed and the number of salt rounds(10 is a good number)
    // salt rounds adds random data to the password before hashing to make it more secure.
    // 10 salt rounds means the hashing algorithm will be applied 10 times.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: { id: user.id, email: user.email },
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // findOne method is used to find a single entry in the database that matches the given criteria.
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare method compares the plain text password with the hashed password stored in the database.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // jwt token comprises of 3 parts: header, payload, and signature.
    // header contains metadata about the token such as the type of token and the algorithm used to sign it.
    // payload contains the claims or statements about an entity (typically, the user) and additional data.
    // signature is used to verify that the token was not altered.
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
