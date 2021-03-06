const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const {
  isWithinInterval,
  addMinutes,
  areIntervalsOverlapping,
} = require("date-fns");

const createTags = (salon, name, address) => {
  salon.tags.push(name, name.toLowerCase());
  salon.tags.push(address.street, address.street.toLowerCase());
  salon.tags.push(
    address.street.split(" ")[0],
    address.street.split(" ")[0].toLowerCase()
  );
  salon.tags.push(address.city, address.city.toLowerCase());
  salon.tags.push(address.county, address.county.toLowerCase());

  const nameSpread = name.split(" ");
  nameSpread.forEach((part) => {
    salon.tags.push(part, part.toLowerCase());
  });
};
// Desc: Creating hair salon account
// Route: POST /hairsalon/create
// Access: Public
module.exports.createSalon = async (req, res, next) => {
  const {
    name,
    description,
    address,
    email,
    phone,
    workingHours,
    password,
  } = req.body;

  const salon = new HairSalon({
    name,
    description,
    address,
    email,
    password,
    phone,
    workingHours,
  });

  createTags(salon, name, address);

  try {
    await salon.save();
    const token = await salon.generateAuthToken();

    res.send({
      success: true,
      salon,
      token,
      message: "Salon uspješno unesen!",
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
  const allowedUpdates = [
    "name",
    "description",
    "email",
    "workingHours",
    "address",
    "phone",
  ]; // koja polja mozemo mijenjati

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

// Desc: Adding hairdressers for a logged in hair salon
// Route: POST /hairsalon/add_hairdresser
// Access: Authenticated
module.exports.addHairdresser = async (req, res, next) => {
  try {
    const { name, phone, workDays } = req.body;

    const salon = await HairSalon.findOne({ _id: req.salon.id });

    if (!salon) {
      res.status(404).send({
        success: false,
        message: "Salon s navedenim id-om ne postoji!",
      });
    }

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
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting all hairdressers
// Route: GET /hairsalon/get_hairdressers
// Access: Authenticated
module.exports.getHairdressers = async (req, res, next) => {
  try {
    const salon = req.salon;

    const sort = {};

    if (req.query.sortBy) {
      const values = req.query.sortBy.split("_");
      const term = values[0];
      sort[term] = values[1] === "asc" ? 1 : -1;
    }
    //console.log(sort);
    const hairdressers = await Hairdresser.find({ salonId: salon._id }, null, {
      sort,
    });

    res.send({ success: true, hairdressers });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Update hairdresser info
// Route: PUT /hairsalon/update_hairdresser/
// Access: Authenticated
module.exports.updateHairdresser = async (req, res, next) => {
  try {
    const { hairdresserId } = req.body;

    const updates = Object.keys(req.body); // vraca array keyeva
    updates.pop("hairdresserId");
    const allowedUpdates = ["name", "phone", "workDays"]; // koja polja mozemo mijenjati

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

    const hairdresser = await Hairdresser.findOne({ _id: hairdresserId });
    if (!hairdresser) {
      return res
        .status(404)
        .send({ success: false, message: "Frizer ne postoji!" });
    }
    updates.forEach((update) => {
      hairdresser[update] = req.body[update]; // dinamicko updatanje keyseva sa [] operatorom
    });
    await hairdresser.save();

    res.send({
      success: true,
      message: "Frizer uspješno ažuriran!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Delete a hairdresser
// Route: DEL /hairsalon/delete_hairdresser
// Access: Authenticated
module.exports.deleteHairdresser = async (req, res, next) => {
  try {
    const { hairdresserId } = req.body;

    const hairdresser = await Hairdresser.findOne({ _id: hairdresserId });

    if (!hairdresser) {
      return res
        .status(400)
        .send({ success: false, message: "Frizer više ne postoji!" });
    }

    //trebalo bi updateat rating salona ako je izbrisan frizer koji ima ocjene
    hairdresser.remove(async (err, hairdresser) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Došlo je do pogreške pri brisanju frizera!",
        });
      }
      console.log("callback: hairdresser deleted!");
      //await review.updateRatings();
    });

    res.send({
      success: true,
      message: "Frizer uspješno izbrisan!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Adding appointment types for a logged in hair salon
// Route: POST /hairsalon/add_appointmentType
// Access: Authenticated
module.exports.addAppointmentType = async (req, res, next) => {
  try {
    const { name, price, duration, description, intendedGender } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).send({
        success: false,
        message: "Nedostaju name, price ili duration!",
      });
    }
    //ako se next(new Error("nesto")) baci isto je ok baci error ali ovako dobijemo porukicu

    const salon = req.salon;

    const appoint = new AppointmentType({
      salonId: req.salon.id,
      name,
      price,
      duration,
      description,
      intendedGender,
    });

    await appoint.save(async (err, app) => {
      if (err) {
        new Error(err);
      }
      console.log("Appointment type saved!");
      salon.appointmentTypes.push(appoint);
      await salon.save(() => {
        console.log("Salon appointment types updated");
      });
    });

    res.send({ success: true, message: "Usluga uspjesno unesena!" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Getting all hairdressers
// Route: GET /hairsalon/get_appointmentTypes
// Access: Authenticated
module.exports.getAppointmentTypes = async (req, res, next) => {
  try {
    const salon = req.salon;

    const sort = {};

    if (req.query.sortBy) {
      const values = req.query.sortBy.split("_");
      const term = values[0];
      sort[term] = values[1] === "asc" ? 1 : -1;
    }
    //console.log(sort);
    const appointmentTypes = await AppointmentType.find(
      { salonId: salon._id },
      null,
      {
        sort,
      }
    );

    res.send({ success: true, appointmentTypes });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Update appointment type info
// Route: PUT /hairsalon/update_appointmentType/
// Access: Authenticated
module.exports.updateAppointmentType = async (req, res, next) => {
  try {
    const { appointmentTypeId } = req.body;

    const updates = Object.keys(req.body); // vraca array keyeva
    updates.pop("appointmentTypeId");
    const allowedUpdates = [
      "name",
      "price",
      "duration",
      "intendedGender",
      "description",
    ]; // koja polja mozemo mijenjati

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

    const appointmentType = await AppointmentType.findOne({
      _id: appointmentTypeId,
    });
    if (!appointmentType) {
      return res
        .status(404)
        .send({ success: false, message: "Ta vrsta termina ne postoji!" });
    }
    updates.forEach((update) => {
      appointmentType[update] = req.body[update]; // dinamicko updatanje keyseva sa [] operatorom
    });
    await appointmentType.save();

    res.send({
      success: true,
      message: "Vrsta termina uspješno ažurirana!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

// Desc: Delete an appointment type
// Route: DEL /hairsalon/delete_appointmentType
// Access: Authenticated
module.exports.deleteAppointmentType = async (req, res, next) => {
  try {
    const { appointmentTypeId } = req.body;

    const appointmentType = await AppointmentType.findOne({
      _id: appointmentTypeId,
    });

    if (!appointmentType) {
      return res
        .status(400)
        .send({ success: false, message: "Ta vrsta termina više ne postoji!" });
    }

    //trebalo bi updateat rating salona ako je izbrisan frizer koji ima ocjene
    appointmentType.remove(async (err, appType) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Došlo je do pogreške pri brisanju vrste termina!",
        });
      }
      console.log("callback: appointment type deleted!");
      //await review.updateRatings();
    });

    res.send({
      success: true,
      message: "Vrsta termina uspješno izbrisana!",
    });
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
// Route: POST /hairsalon/confirm_appointment
// Access: Authenticated
module.exports.confirmAppointment = async (req, res, next) => {
  try {
    const salon = req.salon;
    const { appointmentId, action } = req.body;

    const appointment = await Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
      res.status(400).send({
        success: false,
        message: "Termin ne postoji ili je izbrisan!",
      });
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const dayStart = new Date(appointmentDate).setHours(0, 0, 0);
    const dayEnd = new Date(appointmentDate).setHours(23, 59, 59);

    const appointments = await Appointment.find({
      salonId: salon._id,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
      confirmed: true,
    });

    if (action === "confirm") {
      //pocetak i kraj odabranog termina u minutama
      const appointmentDateTimeStart = new Date(appointmentDate);
      appointmentDateTimeStart.setHours(
        appointment.startTime.hours,
        appointment.startTime.minutes,
        0
      );

      const appointmentDateTimeEnd = new Date(appointmentDate);

      appointmentDateTimeEnd.setHours(
        appointment.endTime.hours,
        appointment.endTime.minutes,
        0
      );

      if (!appointment.hairdresserId) {
        //prolazak kroz termine za odabrani datum i provjera ako se preklapa s nekim i vraca prikladan boolean
        for (const app of appointments) {
          //usporedjuju se samo termini koji nemaju frizera odredjenog
          if (!app.hairdresserId) {
            const start = new Date(app.appointmentDate).setHours(
              app.startTime.hours,
              app.startTime.minutes,
              0
            );

            const end = new Date(app.appointmentDate).setHours(
              app.endTime.hours,
              app.endTime.minutes,
              0
            );

            /* console.log("pocetak termina: ", appointmentDateTimeStart);
            console.log("kraj termina: ", appointmentDateTimeEnd);
            console.log("pocetak termina u petlji: ", start);
            console.log("kraj termina u petlji: ", end); */
            //ako se preklapaju intervali odabranih termina i onih u bazi, cak i jedna minuta, ne dopusta se rezervacija
            if (
              areIntervalsOverlapping(
                {
                  start: appointmentDateTimeStart,
                  end: appointmentDateTimeEnd,
                },
                {
                  start,
                  end,
                }
              )
            ) {
              return res.status(400).send({
                success: false,
                message:
                  "Nije dopušteno potvrditi termin jer se on preklapa sa nekim od postojećih termina. Molimo odbijte termin.",
              });
            }
          }
        }
        //ako postoji hairdresser provjeravamo ako je za odabran termin on slobodan ili ne, tj ako se preklapaju termini
      } else {
        for (const app of appointments) {
          if (String(appointment.hairdresserId) === String(app.hairdresserId)) {
            const start = new Date(app.appointmentDate).setHours(
              app.startTime.hours,
              app.startTime.minutes,
              0
            );
            const end = new Date(app.appointmentDate).setHours(
              app.endTime.hours,
              app.endTime.minutes,
              0
            );

            //ako se preklapaju intervali odabranih termina i onih u bazi, cak i jedna minuta, ne dopusta se rezervacija
            if (
              areIntervalsOverlapping(
                {
                  start: appointmentDateTimeStart,
                  end: appointmentDateTimeEnd,
                },
                {
                  start,
                  end,
                }
              )
            ) {
              return res.status(400).send({
                success: false,
                message:
                  "Nije dopušteno potvrditi termin jer se on preklapa sa nekim od postojećih termina. Molimo odbijte termin.",
              });
            }
          }
        }
      }
      appointment.confirmed = true;
    } else {
      appointment.completed = true;
    }
    await appointment.save((err, app) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Došlo je do pogreške pri potvrdi termina",
        });
      }
    });
    const message =
      action === "confirm"
        ? "Termin uspješno potvrđen"
        : "Termin uspješno odbijen";

    res.send({ success: true, message });
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

// Desc: Get all reviews
// Route: GET /hairsalon/get_reviews
// Access: Authenticated
module.exports.getReviews = async (req, res, next) => {
  try {
    const salonId = req.salon._id;

    const sort = {};
    const limit = 10;

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
