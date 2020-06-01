const mongoose = require("mongoose");

const workHours = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  dayName: {
    type: String,
    enum: [
      "ponedjeljak",
      "utorak",
      "srijeda",
      "četvrtak",
      "petak",
      "subota",
      "nedjelja",
    ],
    required: true,
  },
  startWorktime: {
    type: Number,
    min: 0,
    max: 24,
    default: null,
  },
  endWorktime: {
    type: Number,
    min: 0,
    max: 24,
    default: null,
  },
});

const hairdresserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  workDays: [workHours],
});

const Hairdresser = mongoose.model("Hairdresser", hairdresserSchema);
module.exports = Hairdresser;
