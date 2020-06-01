const express = require("express");
const router = express.Router();

//import hair salon controller
const { createSalon, submitReview } = require("../controllers/salonController");

//routes for the hair salon handling
router.route("/").get(createSalon);
router.route("/hairsalon/:id/submit_review").get(submitReview);

module.exports = router;
