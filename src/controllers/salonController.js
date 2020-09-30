const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

const bcrypt = require("bcrypt");

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

// Desc: Updating profile data(password not allowed on this route)
// Route: PUT /hairsalon/update_profile
// Access: Authenticated
module.exports.updateProfile = async (req, res, next) => {
  const updates = Object.keys(req.body); // vraca array keyeva
  const allowedUpdates = ["name", "email", "workingHours", "address", "phone"]; // koja polja mozemo mijenjati

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
    const salon = req.salon;
    if (!salon) {
      return res
        .status(404)
        .send({ success: false, message: "Salon ne postoji!" });
    }
    updates.forEach((update) => {
      salon[update] = req.body[update]; // dinamicko updatanje keyseva sa [] operatorom
    });
    await salon.save();

    res.send({
      success: true,
      salon,
      message: "Profil salona uspješno ažuriran!",
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

// Desc: Getting all info for the logged in hair salon
// Route: GET /hairsalon/get_profile
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

// Desc: Changing password for a user
// Route: PUT /user/change_password
// Access: Authenticated
module.exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const salon = req.salon;

    if (!salon) {
      return res
        .status(400)
        .send({ success: false, message: "Salon ne postoji!" });
    }

    const match = await bcrypt.compare(oldPassword, salon.password);
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

    salon.password = newPassword;
    await salon.save();

    res.send({
      success: true,
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
// Desc: Confirm an appointment
// Route: GET /hairsalon/get
// Access: Authenticated
module.exports.confirmSalon = async (req, res, next) => {
  try {
    const salon = req.salon;
    const { appointmentId } = req.body;

    const appointment = await Appointment.findOne({ _id: appointmentId });

    if (!appointment) {
      res.status(400).send({
        success: false,
        message: "Termin ne postoji ili je izbrisan!",
      });
    }

    res.send({ success: true, message: "Termin uspješno potvrđen" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting appointments for a salon
// Route: GET /hairsalon/get_appointments
// Access: Authenticated
module.exports.getAppointments = async (req, res, next) => {
  try {
    const salon = req.salon;
    const searchDate = req.query.searchDate;

    const dayStart = new Date(searchDate).setHours(0, 0, 0);
    const dayEnd = new Date(searchDate).setHours(23, 59, 59);

    //pet reviewa po stranici cemo prikazivati
    const sort = {};
    //const limit = 3; nema limita jer ih nece puno bit

    if (req.query.sortBy) {
      const values = req.query.sortBy.split("_");
      const term = values[0];
      sort[term] = values[1] === "asc" ? 1 : -1;
    }

    const filter = req.query.filter;
    const search = {
      salonId: salon._id,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
    };

    if (filter === "onHold") {
      search.completed = false;
      search.confirmed = false;
    } else if (filter === "active") {
      search.confirmed = true;
      search.completed = false;
    } else if (filter === "archived") {
      search.completed = true; // termin ce imati completed true automatski kad prodje datum termina neovisno o fizičkom izvršetku
    } // inace baca sve skupa

    //console.log(sort);
    //const skip = req.query.page ? req.query.page * limit : null;
    const appointments = await Appointment.find(search, null, {
      sort,
    }).populate("userId hairdresserId appointmentType");

    res.send({
      success: true,
      appointments,
    });
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
