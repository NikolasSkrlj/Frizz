const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//import hair salon controller
const {
  createSalon,
  loginSalon,
  logoutSalon,
  getSalon,
  getAppointments,
  submitReview,
  createAppointmentType,
  addHairdresser,
  updateProfile,
  changePassword,
} = require("../controllers/salonController");

//routes for the hair salon handling
router.route("/create").post(createSalon);
router.route("/login").post(loginSalon);
router.route("/logout").post(auth, logoutSalon);
router.route("/get_profile").get(auth, getSalon);
router.route("/update_profile").put(auth, updateProfile);
router.route("/change_password").put(auth, changePassword);

router.route("/get_appointments").get(auth, getAppointments);
router.route("/create_appointment_type").post(auth, createAppointmentType);
router.route("/add_hairdresser").post(auth, addHairdresser);

module.exports = router;
