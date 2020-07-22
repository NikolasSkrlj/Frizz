const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

module.exports.createSalon = async (req, res, next) => {
  const wk = [
    {
      index: 1,
      dayName: "ponedjeljak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 2,
      dayName: "utorak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 3,
      dayName: "srijeda",
      startWorktime: 14,
      endWorktime: 21,
    },
    {
      index: 4,
      dayName: "četvrtak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 5,
      dayName: "petak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 6,
      dayName: "subota",
      startWorktime: 14,
      endWorktime: 21,
    },
    {
      index: 7,
      dayName: "nedjelja",
      startWorktime: null,
      endWorktime: null,
    },
  ];

  const salon = new HairSalon({
    name: "Lori",
    address: {
      street: "Ročko polje 2",
      postalCode: 52426,
      city: "Lupoglav",
    },
    email: "dada@haha.com",
    phone: "0981371388",
    workingHours: wk,
  });
  try {
    await salon.save();
    res.send({ success: true, salon, message: "Salon uspjesno unesen!" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Dogodila se pogreška", error: err });
  }
  /* ((err) => {
    if (err) {
      res.status(500).send({ message: "Dogodila se pogreška" });
    }
    res.send({ salon, message: "Salon uspjesno unesen!" });
  }); */
};

module.exports.getSalon = async (req, res, next) => {
  try {
    const salon = await HairSalon.findById(req.params.id)
      .populate("appointmentTypes")
      .exec();

    res.send({ success: true, salon });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Dogodila se pogreška", error: err });
  }
};

module.exports.createAppointmentType = async (req, res, next) => {
  const salon = await HairSalon.findOne({ _id: req.params.id });

  if (salon) {
    const appoint = new AppointmentType({
      salonId: req.params.id,
      name: "bojanje kose",
      price: 150,
      duration: 100,
      description: "Malo kompliciranije bojanje kose",
      intendedGender: "Ž",
    });
    try {
      await appoint.save(() => {
        console.log("Appointment type saved!");
      });
      salon.appointmentTypes.push(appoint);
      await salon.save();

      res.send({ success: true, appoint, message: "Usluga uspjesno unesena!" });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, message: "Dogodila se pogreška", error: err });
    }
  } else {
    res.status(404).send({
      success: false,
      message: "Salon s navedenim id-om ne postoji!",
    });
  }
};

// testna ruta
module.exports.submitReview = async (req, res, next) => {
  const review = {
    userId: "5ed530936a6e0432bce70b64",
    rating: 3.5,
    comment: "A cuj moze i bolje",
  };

  try {
    const reviewed = await Hair_Salon.findOne({ _id: req.params.id });
    reviewed.reviews.push(review);
    const result = await reviewed.save();
    console.log(result);
    res.send({ success: true, message: "Review submited successfully!" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Dogodila se pogreška", error: err });
  }
};
