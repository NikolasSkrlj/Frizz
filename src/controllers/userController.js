const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      phone,
      password,
      isSalonAdmin,
    } = req.body;

    const user = new User({
      name,
      age,
      email,
      gender,
      isSalonAdmin,
      phone,
      password,
    });

    await user.save();
    const token = await user.generateAuthToken();

    res.send({ success: true, user, message: "Korisnik uspjesno unesen!" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Dogodila se pogreška",
      error: err.toString(),
    });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
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
