const express = require("express");
const router = express.Router();

//import salon controller
const { createSalon } = require("../controllers/salonController");

//routes for the salon handling
router.route("/").get(createSalon);

module.exports = router;
