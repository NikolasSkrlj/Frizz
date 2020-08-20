const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//import hair salon controller
const {
  createUser,
  loginUser,
  logoutUser,
  getProfile,
  getSalons,
  submitReview,
  createAppointment,
} = require("../controllers/userController");

//routes for the hair salon handling
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
router.route("/profile").get(auth, getProfile);
router.route("/salons").get(auth, getSalons);
router.route("/submit_review/:id").post(auth, submitReview);
router.route("/:id/create_appointment").post(auth, createAppointment);
module.exports = router;
