const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// GLAVNA SCHEMA
const HairSalonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Insert a valid email!");
        }
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    externalLinks: {
      type: [String],
      default: [],
    },
    gallery: [Buffer],
    workingHours: {
      type: [workHours],
    },
    appointmentTypes: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "AppointmentType",
    },
    appointments: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Appointment",
    },
    hairdressers: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Hairdresser",
    },
    reviews: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Review",
    },
  },
  //ovdje treba nadodati tip podatka za spremat rezervacije, nekako u formatu kalendara, za to jos trazim rjesenja
  //recenzije isto moraju bit, kombinacija komentara i brojevnih ocjena, array vjerovatno pa se racuna prosjek -> ako bude princip
  //sa zapolenicima onda treba i mogucnost njih ocjenit i napravit da se to racuna u konacnu ocjenu

  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

//Ovako se radi model, schema je prosireni model ina way, prvi arg je ime a drugi je struktura
const HairSalon = mongoose.model("HairSalon", HairSalonSchema);

module.exports = HairSalon;
