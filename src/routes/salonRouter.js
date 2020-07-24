const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//import hair salon controller
const {
  createSalon,
  loginSalon,
  logoutSalon,
  getSalon,
  submitReview,
  createAppointmentType,
  addHairdresser,
} = require("../controllers/salonController");

//routes for the hair salon handling
router.route("/create").post(createSalon);
router.route("/login").post(loginSalon);
router.route("/logout").post(auth, logoutSalon);
router.route("/get").get(auth, getSalon);
router.route("/create_appointment_type").post(auth, createAppointmentType);
router.route("/add_hairdresser").post(auth, addHairdresser);
router.route("/:id/submit_review").post(submitReview);

module.exports = router;
