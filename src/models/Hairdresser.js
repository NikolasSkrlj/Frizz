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
  startTime: {
    type: Number,
    min: 0,
    max: 24,
    default: null,
  },
  endTime: {
    type: Number,
    min: 0,
    max: 24,
    default: null,
  },
});

const hairdresserSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    workDays: [workHours],
    globalRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review",
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const Hairdresser = mongoose.model("Hairdresser", hairdresserSchema);
module.exports = Hairdresser;
