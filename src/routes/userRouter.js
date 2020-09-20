const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
//import hair salon controller
const {
  //Za usera
  createUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  uploadProfilePic,
  getProfilePic,
  changePassword,
  //Za salone
  getSalons,
  getSalonById,
  submitReview,
  editReview,
  deleteReview,
  getReviews,
  checkDate,
  createAppointment,
  getAppointments,
  deleteAppointment,
} = require("../controllers/userController");

//config file za upload
const upload = multer({
  limits: {
    fileSize: 5000000, // 5 MB
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
      // regex, \ je escape char za tocku, (| je ili ili)
      return cb(new Error("Datoteka mora biti formata .jpg, .png, ili .jpeg!"));
    }
    cb(undefined, true);

    /* callback odredjuje kako cemo respondati
    cb(new Error("File must be an image")) // baca error ako je nesto krivo
    cb(undefined, true); // error je ndefined i dopusta upload
    cb(undefined, false); // nema errora al ne dopusta upload
    
    file sadrzi sve podatke o fileu
    */
  },
});

//routes for the hair salon handling

//user data handling
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
//router.route("/profile").get(auth, getProfile);
router.route("/get_profile").get(auth, getProfile);
router.route("/update_profile").put(auth, updateProfile);
router
  .route("/upload_pic")
  .post(auth, upload.single("profilePic"), uploadProfilePic);
router.route("/:id/profile_pic").get(getProfilePic);
router.route("/change_password").put(auth, changePassword);
router.route("/get_appointments").get(auth, getAppointments);
router.route("/delete_appointment").delete(auth, deleteAppointment);

//salon feed
router.route("/get_salons").get(auth, getSalons);
router.route("/salon/:salonId").get(auth, getSalonById);

//reviews
router.route("/:salonId/submit_review").post(auth, submitReview);
router.route("/edit_review").put(auth, editReview);
router.route("/delete_review").delete(auth, deleteReview);

//salon feed
router.route("/:salonId/check_date").post(auth, checkDate);
router.route("/:salonId/create_appointment").post(auth, createAppointment);
router.route("/:salonId/reviews").get(auth, getReviews);

module.exports = router;
