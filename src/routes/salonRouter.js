const express = require("express");
const router = express.Router();

//import hair salon controller
const {
  createSalon,
  getSalon,
  submitReview,
  createAppointmentType,
  addHairdresser,
} = require("../controllers/salonController");

//routes for the hair salon handling
router.route("/create").post(createSalon);
router.route("/get/:id").get(getSalon);
router.route("/:id/create_appointment_type").post(createAppointmentType);
router.route("/:id/add_hairdresser").post(addHairdresser);
router.route("/:id/submit_review").post(submitReview);

module.exports = router;
