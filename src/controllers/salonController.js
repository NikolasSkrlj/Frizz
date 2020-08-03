const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

// Desc: Creating hair salon account
// Route: POST /hairsalon/create
// Access: Public
module.exports.createSalon = async (req, res, next) => {
  const { name, address, email, phone, workingHours, password } = req.body;

  const salon = new HairSalon({
    name,
    address,
    email,
    password,
    phone,
    workingHours,
  });

  try {
    await salon.save();
    const token = await salon.generateAuthToken();

    res.send({
      success: true,
      salon,
      token,
      message: "Salon uspjesno unesen!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Logging in the hair salon account
// Route: POST /hairsalon/login
// Access: Public
module.exports.loginSalon = async (req, res, next) => {
  try {
    const salon = await HairSalon.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await salon.generateAuthToken();

    //overwritali smo toJSON metodu da filtriramo sta saljemo, ne zelimo da se vidi password i tokeni u responsu
    res.send({ salon: salon, token });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Logging out of the hair salon account
// Route: POST /hairsalon/logout
// Access: Authenticated
module.exports.logoutSalon = async (req, res, next) => {
  try {
    req.salon.tokens = req.salon.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.salon.save();
    res.send({ success: true, message: "Uspjesno ste odjavljeni" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

/*
OVDJE TREBA DORADITI POPULATE SA $match, $sort, $project itd TAKO DA SE IMA MOGUCNOST FILTRIRANJA PODATAKA
*/
// Desc: Getting all info for the logged in hair salon
// Route: GET /hairsalon/get
// Access: Authenticated
module.exports.getSalon = async (req, res, next) => {
  try {
    const salon = req.salon;

    //populate na vise razina, salon ima svoje recenzije i frizere kojima se takodjr populateaju recenzije
    await salon
      .populate({
        path: "hairdressers reviews appointmentTypes appointments",
        populate: {
          path: "reviews appointmentType",
        },
      })
      .execPopulate(); // kad se ne koristi u kombinaciji sa Model.findNesto koristi se execPopulate a ne populate
    //await salon.hairdressers.populate("reviews").execPopulate(); isto radi ali nama treba gornji izraz zbog gnjijezdenja

    res.send({ success: true, salon });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Adding hairdressers for a logged in hair salon
// Route: POST /hairsalon/add_hairdresser
// Access: Authenticated
module.exports.addHairdresser = async (req, res, next) => {
  try {
    const { name, phone, workDays } = req.body;

    const salon = await HairSalon.findOne({ _id: req.salon.id });

    if (salon) {
      const hairdresser = new Hairdresser({
        salonId: req.salon.id,
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

// Desc: Adding appointment types for a logged in hair salon
// Route: POST /hairsalon/create_appointment_type
// Access: Authenticated
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

    const salon = await HairSalon.findOne({ _id: req.salon.id });

    if (salon) {
      const appoint = new AppointmentType({
        salonId: req.salon.id,
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
