const express = require("express");
const router = express.Router();

//import hair salon controller
const {
  createSalon,
  getSalon,
  submitReview,
  createAppointmentType,
} = require("../controllers/salonController");

//routes for the hair salon handling
router.route("/").get(createSalon);
router.route("/get/:id").get(getSalon);
router.route("/hairsalon/:id/createappointmenttype").get(createAppointmentType);
router.route("/hairsalon/:id/submit_review").get(submitReview);

module.exports = router;
