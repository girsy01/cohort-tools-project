const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Signup successful
 *       403:
 *         description: Email already taken
 *       500:
 *         description: Server error
 */
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      res.status(403).json({ message: "Email already taken" });
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(password, salt);

      const createdUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.status(200).json({ message: "Signup successful", user: createdUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      res.status(403).json({ message: "Invalid credentials" });
    } else {
      const isPasswordCorrect = bcryptjs.compareSync(password, foundUser.password);
      if (!isPasswordCorrect) {
        res.status(403).json({ message: "Invalid credentials" });
        return;
      }

      const authToken = jwt.sign(
        { _id: foundUser._id, name: foundUser.name },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "48h",
        }
      );

      res.status(200).json({ message: "Login successful", authToken });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify the authentication token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid, and current user data is returned
 *       401:
 *         description: Unauthorized (invalid or expired token)
 */
router.get("/verify", isAuthenticated, (req, res) => {
  console.log("Verified user:", req.payload);
  res.status(200).json({ currentUser: req.payload });
});

module.exports = router;
