const HairSalon = require("../models/HairSalon");
const Hairdresser = require("../models/Hairdresser");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const AppointmentType = require("../models/AppointmentType");
const User = require("../models/User");

const appointmentCheck = async (req, res, next) => {
  const {
    hairdresserId,
    appointmentDate,
    startTime,
    endTime,
    appointmentType,
  } = req.body;
  const salonId = req.params.id;
  const user = req.user;

  const salon = await HairSalon.findOne({ _id: salonId }).populate(
    "hairdressers appointments appointmenttypes"
  );
};
