const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//import hair salon controller
const {
  createSalon,
  loginSalon,
  logoutSalon,
  changePassword,
  getSalon,
  getHairdressers,
  getAppointments,
  addHairdresser,
  updateHairdresser,
  deleteHairdresser,
  updateProfile,
  addAppointmentType,
  getAppointmentTypes,
  updateAppointmentType,
  deleteAppointmentType,
  getReviews,
  confirmAppointment,
} = require("../controllers/salonController");

//routes for the hair salon handling

//salon
router.route("/create").post(createSalon);
router.route("/login").post(loginSalon);
router.route("/logout").post(auth, logoutSalon);
router.route("/confirm_appointment").post(auth, confirmAppointment);
router.route("/change_password").put(auth, changePassword);
router.route("/get_profile").get(auth, getSalon);
router.route("/update_profile").put(auth, updateProfile);

//frizeri
router.route("/add_hairdresser").post(auth, addHairdresser);
router.route("/get_hairdressers").get(auth, getHairdressers);
router.route("/update_hairdresser").put(auth, updateHairdresser);
router.route("/delete_hairdresser").delete(auth, deleteHairdresser);
router.route("/get_appointmentTypes").get(auth, getAppointmentTypes);

//Vrste termina
router.route("/get_appointments").get(auth, getAppointments);
router.route("/add_appointmentType").post(auth, addAppointmentType);
router.route("/update_appointmentType").put(auth, updateAppointmentType);
router.route("/delete_appointmentType").delete(auth, deleteAppointmentType);

//recenzije
router.route("/get_reviews").get(auth, getReviews);

module.exports = router;
