const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
//import hair salon controller
const {
  createUser,
  loginUser,
  logoutUser,
  getProfile,
  getProfileById,
  getSalons,
  submitReview,
  checkDate,
  createAppointment,
  updateProfile,
  uploadProfilePic,
  getProfilePic,
} = require("../controllers/userController");

//config file za upload
const upload = multer({
  limits: {
    fileSize: 5000000, // 1 MB
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
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(auth, logoutUser);
//router.route("/profile").get(auth, getProfile);
router.route("/:id/profile").get(auth, getProfileById);
router.route("/:id/update").put(auth, updateProfile);
router
  .route("/:id/upload_pic")
  .post(auth, upload.single("profilePic"), uploadProfilePic);
router.route("/:id/profile_pic").get(getProfilePic);
router.route("/salons").get(auth, getSalons);
router.route("/submit_review/:id").post(auth, submitReview); // to treba promjenit obrnuti redoslijed
router.route("/:salonId/check_date").post(auth, checkDate);
router.route("/:salonId/create_appointment").post(auth, createAppointment);
module.exports = router;
