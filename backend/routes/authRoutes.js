const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/register
router.post("/register", registerUser);

// POST /api/login
router.post("/login", loginUser);

module.exports = router;
