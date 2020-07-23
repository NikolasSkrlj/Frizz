const express = require("express");
const router = express.Router();

//import hair salon controller
const { createUser, loginUser } = require("../controllers/userController");

//routes for the hair salon handling
router.route("/create").post(createUser);
router.route("/login").post(loginUser);

module.exports = router;
