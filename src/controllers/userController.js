//Models
const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

const mongoose = require("mongoose");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Desc: Creating a user account
// Route: POST /user/create
// Access: Public
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, age, gender, email, phone, password } = req.body;
    //console.log(req.body);
    const found = await User.findOne({ email: email });
    if (found) {
      return res.status(400).send({
        success: false,
        message: "Korisnik s tim e-mailom vec postoji!",
      });
    }

    const user = new User({
      name,
      age,
      email,
      gender,
      phone,
      password,
    });

    await user.save();
    const token = await user.generateAuthToken();

    res.send({
      success: true,
      user,
      token,
      message: "Korisnički račun uspješno napravljen!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message:
        "Došlo je do pogreške pri kreiranju korisničkog računa, pokušajte ponovno!",
      error: err.toString(),
    });
  }
};

// Desc: Logging in the user account
// Route: POST /user/logout
// Access: Public
module.exports.loginUser = async (req, res, next) => {
  try {
    //validacija na frontendu, required polja
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    //overwritali smo toJSON metodu da filtriramo sta saljemo, ne zelimo da se vidi password i tokeni u responsu
    res.send({ user: user, token });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Logging out of the user account
// Route: POST /user/logout
// Access: Authenticated
module.exports.logoutUser = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ success: true, message: "Uspjesno ste odjavljeni" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting profile info for the logged in user
// Route: POST /user/profile
// Access: Authenticated
module.exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    await user.populate("reviews").execPopulate(); // kad se ne koristi u kombinaciji sa Model.findNesto koristi se execPopulate a ne populate

    res.send({ success: true, user });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};
// Desc: Getting salon info by his id
// Route: GET /user/salon/:salonId
// Access: Authenticated
module.exports.getSalonById = async (req, res, next) => {
  try {
    const salon = await HairSalon.findOne({ _id: req.params.salonId }).populate(
      {
        path: "hairdressers reviews appointmentTypes appointments",
        populate: {
          path: "reviews appointmentType",
        },
      }
    ); // kad se ne koristi u kombinaciji sa Model.findNesto koristi se execPopulate a ne populate

    res.send({ success: true, salon });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting profile info for the logged in user
// Route: GET /:id/profile
// Access: Authenticated
module.exports.getProfileById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "reviews appointments"
    );

    if (!user) {
      res.status(400).send({ success: false, message: "Korisnik ne postoji" });
    }

    res.send({ success: true, user });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Updating profile data(password not allowed on this route)
// Route: PUT /user/:id/update
// Access: Authenticated
module.exports.updateProfile = async (req, res, next) => {
  const updates = Object.keys(req.body); // vraca array keyeva
  const allowedUpdates = ["name", "email", "gender", "age", "phone"]; // koja polja mozemo mijenjati

  // ovo nije potrebno ali dobro je useru dat feedback
  //every radi kao for each ali vraca boolean ovisno o svakom elementu arraya
  const isValid = updates.every((key) => {
    return allowedUpdates.includes(key);
  });

  if (!isValid) {
    return res.status(400).send({
      success: false,
      message: "Pokušali ste mijenjati nedozvoljene podatke!",
    });
  }

  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Korisnik ne postoji!" });
    }
    updates.forEach((update) => {
      user[update] = req.body[update]; // dinamicko updatanje keyseva sa [] operatorom
    });
    await user.save();

    res.send({ success: true, user, message: "Profil uspješno ažuriran!" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Changing password for a user
// Route: PUT /user/:id/change_password
// Access: Authenticated
module.exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Korisnik ne postoji!" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Promijena lozinke nije dozvoljena!",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).send({
        success: false,
        message: "Nova lozinka ne može biti stara lozinka!",
      });
    }

    user.password = newPassword;
    await user.save();

    res.send({
      success: true,
      user,
      message: "Lozinka uspješno promijenjena!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};
// Desc: Uploading profile pic for user
// Route: POST /user/:id/update
// Access: Authenticated
module.exports.uploadProfilePic = async (req, res, next) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const user = await User.findOne({ _id: req.params.id });

    user.profilePic = buffer; //req.file.buffer mozemo pristupiti samo ako u upload objekt ne zadamo dest: property
    await user.save();
    res.send({
      success: true,
      message:
        "Profilna slika uspješno prenesena! (promjena će biti vidljiva pri sljedećoj prijavi ili ako osvježite stranicu)",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message:
        "Dogodila se pogreška! Provjerite da je datoteka ispravnog formata i dozvoljene veličine(5 Mb)",
      error: err.toString(),
    });
  }
};

// Desc: GET profile pic for a user
// Route: GET /user/:id/profile-pic
// Access: Authenticated
module.exports.getProfilePic = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user || !user.profilePic) {
      return res.status(400).send({
        success: false,
        message: "Slikovna datoteka ne postoji!",
      });
    }

    res.set("Content-Type", "image/jpg"); //moramo rucno postaviti ali radi i bez
    res.send(user.profilePic);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting salons
// Route: POST /user/profile
// Access: Authenticated
module.exports.getSalons = async (req, res, next) => {
  try {
    const sort = {};
    const limit = 5;

    if (req.query.sortBy) {
      const values = req.query.sortBy.split("_");
      const term = values[0];
      sort[term] = values[1] === "asc" ? 1 : -1;
    }

    //filtriranje ovisno o ratingu format filter=globalRating_2 znaci sve vece od dva ili jednako
    /* Filtriranje ovisno o zupaniji
    format county=Istarska gdje se matcha tocno

    nemoze se napravit search.address = {} i onda search.address = {county: "Istarska"} jer to matcha tocno taj 
    objekt tj adresa bi trebala imat samo county property a cak i ako se navedu svi property redoslijed treba biti tocan ko u bazi
    
    */
    const match = {};

    const filterValues = req.query.filters.split("|");
    const ratingFilter = filterValues[0].split("_");
    const countyFilter = filterValues[1].split("_");

    //filter za rating, default je 0+
    match.globalRating = { $gte: ratingFilter[1] };

    //filter za zupanije, default je bilo koja
    if (countyFilter[1] !== "any") {
      match["address.county"] = countyFilter[1];
    }

    // za search term, sta trazimo gledamo ako se podudara sa tagovima salona tagove cemo dinamicki dodavat pri izradi salona i dodavanju frizera itd
    // ili staticki ako hoce
    if (req.query.q) {
      const search = req.query.q.split(" ");
      match.tags = { $in: search };
    }

    //console.log(match);
    const hairsalonsCnt = await HairSalon.countDocuments(match);

    const skip = req.query.page ? req.query.page * limit : null;

    const salons = await HairSalon.find(match, null, {
      sort,
      limit,
      skip,
    }).populate({
      path: "hairdressers reviews appointmentTypes appointments",
      populate: {
        path: "reviews appointmentType",
      },
    }); // tu moraju ic sve opcije i parametri za filtriranje

    res.send({ success: true, salons, totalSalonsCnt: hairsalonsCnt });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting which time in a day are taken for a date
// Route: GET /user/:salonId/check_date
// Access: Authenticated
module.exports.checkDate = async (req, res, next) => {
  try {
    const user = req.user;
    const salonId = req.params.salonId;
    const appointmentDate = req.body.appointmentDate;

    const dayStart = new Date(appointmentDate).setHours(0, 0, 0);
    const dayEnd = new Date(appointmentDate).setHours(23, 59, 59);

    const appointments = await Appointment.find({
      salonId,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
    })
      .sort("appointmentDate")
      .populate("appointmentType hairdresserId");

    const salon = await HairSalon.findOne({ _id: salonId }).populate(
      "appointments"
    );

    const userAppoints = await Appointment.findOne({
      salonId,
      userId: user.id,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
    });
    const userCheck = userAppoints ? true : false;

    res.send({ success: true, salon, appointments, userCheck });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Create an appointment for a specific day
// Route: POST /user/:id/create_appointment
// Access: Authenticated
module.exports.createAppointment = async (req, res, next) => {
  try {
    const {
      hairdresserId,
      appointmentDate,
      startTime,
      endTime,
      appointmentType,
    } = req.body;
    const salonId = req.params.salonId;
    const user = req.user;

    const appointment = new Appointment({
      salonId,
      userId: user._id,
      hairdresserId,
      startTime,
      endTime,
      appointmentDate: appointmentDate,
      appointmentType,
    });

    //ovdje bi trebala provjera ako ima tog salona al nema smisla to zasad
    const salon = await HairSalon.findOne({ _id: salonId });

    await appointment.save(async (err) => {
      if (err) throw new Error(err);
      console.log("Appointment saved!");

      salon.appointments.push(appointment);
      await salon.save(() => {
        console.log("Salon appointments updated");
      });
    });
    res.send({ success: true, appointment });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Edit submitted review
// Route: PUT /user/edit_review/
// Access: Authenticated
module.exports.editReview = async (req, res, next) => {
  try {
    const { rating, hairdresserId, comment, reviewId } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      return res
        .status(400)
        .send({ success: false, message: "Recenzija više ne postoji!" });
    }

    review.rating = rating;
    review.comment = comment.trim();

    if (hairdresserId) {
      review.hairdresserId = hairdresserId;
    }
    await review.save((err, review) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Došlo je do pogreške pri ažuriranju recenzije!",
        });
      }
      console.log("callback: Recenzija updateana!");
    });
    await review.updateRatings();

    res.send({
      success: true,
      message: "Recenzija uspješno uređena!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Delete a review
// Route: DEL /user/delete_review
// Access: Authenticated
module.exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
      return res
        .status(400)
        .send({ success: false, message: "Recenzija više ne postoji!" });
    }

    review.remove(async (err, review) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Došlo je do pogreške pri brisanju recenzije!",
        });
      }
      console.log("callback: review deleted!");
      await review.updateRatings();
    });

    res.send({
      success: true,
      message: "Recenzija uspješno uređena!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};
// Desc: Edit a review
// Route: PUT /user/submit_review
// Access: Authenticated
module.exports.submitReview = async (req, res, next) => {
  try {
    const { rating, hairdresserId, comment } = req.body;

    const user = req.user;
    const salon = await HairSalon.findOne({ _id: req.params.salonId });

    if (salon) {
      const review = new Review({
        salonId: req.params.salonId,
        userId: user._id,
        rating,
        hairdresserId,
        comment,
      });

      //Ovakvo nestanje potrebno je zbog redoslijeda spremanja modela jer tocno takav redoslijed treba biti
      await review.save(async (err) => {
        if (err) throw new Error(err);
        console.log("Review created");

        salon.reviews.push(review);
        await salon.save(async (err) => {
          if (err) throw new Error(err);
          console.log("Salon reviews updated!");

          user.reviews.push(review);
          await user.save(async (err) => {
            if (err) throw new Error(err);
            console.log("User reviews updated!");

            if (hairdresserId) {
              const hairdresser = await Hairdresser.findOne({
                _id: hairdresserId,
              });

              if (!hairdresser) {
                return res.status(404).send({
                  success: false,
                  message: "Frizer kojeg ste odabrali ne postoji!",
                });
              }
              hairdresser.reviews.push(review);
              await hairdresser.save(async (err) => {
                if (err) throw new Error(err);
                console.log("Hairdresser reviews updated!");
              });
            }
            await review.updateRatings();
          });
        });
      });

      const reviews = [...salon.reviews];
      res.send({
        success: true,
        reviews,
        message: "Recenzija uspješno unesena!",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Salon s navedenim id-om ne postoji!",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Get all reviews for a salon
// Route: GET /user/:salonId/reviews
// Access: Authenticated
module.exports.getReviews = async (req, res, next) => {
  try {
    const salonId = req.params.salonId;

    //pet reviewa po stranici cemo prikazivati
    const sort = {};
    const limit = 3;

    if (req.query.sortBy) {
      const values = req.query.sortBy.split("_");
      const term = values[0];
      sort[term] = values[1] === "asc" ? 1 : -1;
    }

    const filter = req.query.filter;
    const search = { salonId };
    if (filter === "salon") {
      search.hairdresserId = null;
    } else if (filter === "hairdressers") {
      search.hairdresserId = { $ne: null };
    }
    const reviewsCnt = await Review.countDocuments(search);

    //console.log(sort);
    const skip = req.query.page ? req.query.page * limit : null;
    const reviews = await Review.find(search, null, {
      sort,
      limit,
      skip,
    }).populate("userId hairdresserId");

    res.send({
      success: true,
      reviews,
      totalReviewsCnt: reviewsCnt,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};
