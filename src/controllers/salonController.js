const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

module.exports.createSalon = async (req, res, next) => {
  const { name, address, email, phone, workingHours } = req.body;

  const salon = new HairSalon({
    name,
    address,
    email,
    phone,
    workingHours,
  });

  try {
    await salon.save();
    res.send({ success: true, salon, message: "Salon uspjesno unesen!" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

module.exports.getSalon = async (req, res, next) => {
  try {
    const salon = await HairSalon.findOne({ _id: req.params.id })
      .populate("appointmentTypes hairdressers reviews")
      .exec();

    if (salon) {
      res.send({ success: true, salon });
    } else {
      res.status(400).send({
        success: false,
        message: "Salon s pripadajucim id-om nije pronadjen!",
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

module.exports.addHairdresser = async (req, res, next) => {
  try {
    const { name, phone, workDays } = req.body;

    const salon = await HairSalon.findOne({ _id: req.params.id });

    if (salon) {
      const hairdresser = new Hairdresser({
        salonId: req.params.id,
        name,
        phone,
        workDays,
      });

      //spremanje u hairdresser model
      await hairdresser.save(() => {
        console.log("Hairdresser saved!");
      });

      //povezivanje salona sa frizerom
      salon.hairdressers.push(hairdresser);
      await salon.save(() => {
        console.log("Salon hairdressers updated!");
      });
      res.send({
        success: true,
        hairdresser,
        message: "Frizer/ka uspjesno unesen/a!",
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

module.exports.createAppointmentType = async (req, res, next) => {
  try {
    const { name, price, duration, description, intendedGender } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).send({
        success: false,
        message: "Nedostaju name, price ili duration!",
      });
    }
    //ako se next(new Error("nesto")) baci isto je ok baci error ali ovako dobijemo porukicu

    const salon = await HairSalon.findOne({ _id: req.params.id });

    if (salon) {
      const appoint = new AppointmentType({
        salonId: req.params.id,
        name,
        price,
        duration,
        description,
        intendedGender,
      });

      await appoint.save(() => {
        console.log("Appointment type saved!");
      });

      salon.appointmentTypes.push(appoint);
      await salon.save(() => {
        console.log("Salon appointment types updated");
      });

      res.send({ success: true, appoint, message: "Usluga uspjesno unesena!" });
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

module.exports.submitReview = async (req, res, next) => {
  try {
    const { user, userId, rating, hairdresserId, comment } = req.body;

    /* TODO
    - razmislit dal da se i frizeru biljeze reviewi ako su za njega
    - mozda i ne treba enum za anon/registriran, ako je hairdresserId null onda nikom nis
    - uvest global rating za hairdressera -> onda ima smisla drzat recenzije njegove
    - ideja: uvest broj odradjenih termina za frizera, nesto kao uvid u iskustvo(opcionalno)
    */
    const salon = await HairSalon.findOne({ _id: req.params.id });
    if (salon) {
      const review = new Review({
        salonId: req.params.id,
        user,
        userId,
        rating,
        hairdresserId,
        comment,
      });

      await review.save(() => {
        console.log("Review saved!");
      });

      salon.reviews.push(review);
      await salon.save(() => {
        console.log("Salon reviews updated!");
      });

      if (userId) {
        const userCheck = User.findOne({ _id: userId });

        if (userCheck) {
          user.reviews.push(review);
          await review.save(() => {
            console.log("User reviews updated!");
          });
        } else {
          return res.status(404).send({
            success: false,
            message: "Korisnik s navedenim id-om ne postoji!",
          });
        }
      }
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
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};
