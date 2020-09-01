const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

// Desc: Creating a user account
// Route: POST /user/create
// Access: Public
module.exports.createUser = async (req, res, next) => {
  try {
    const { name, age, gender, email, phone, password } = req.body;

    const found = await User.findOne({ email: email });
    if (found) {
      return res.status(400).send({
        success: false,
        message: "Korisnik s tim emailom vec postoji!",
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
      message: "Korisnik uspjesno unesen!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
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

// Desc: Getting salons
// Route: POST /user/profile
// Access: Authenticated
module.exports.getSalons = async (req, res, next) => {
  try {
    const salons = await HairSalon.find({}).populate({
      path: "hairdressers reviews appointmentTypes appointments",
      populate: {
        path: "reviews appointmentType",
      },
    }); // tu moraju ic sve opcije i parametri za filtriranje

    res.send({ success: true, salons });
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

// Desc: Submit review for a specific hair salon
// Route: POST /user/submit_review
// Access: Authenticated
module.exports.submitReview = async (req, res, next) => {
  try {
    const { rating, hairdresserId, comment } = req.body;

    const user = req.user;
    const salon = await HairSalon.findOne({ _id: req.params.id });

    if (salon) {
      const review = new Review({
        salonId: req.params.id,
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
                  message: "Frizer/ka s navedenim id-om ne postoji!",
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

      res.send({
        success: true,
        review,
        message: "Recenzija uspjesno unesena!",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Salon s navedenim id-om ne postoji!",
      });
    }
  } catch (err) {
    next(err);

    /* res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });*/
  }
};
