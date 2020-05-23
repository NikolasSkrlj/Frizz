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
const SalonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    address: {
      type: String, //ovo je placeholder, imat ce pravilnu strukturu adrese
      required: true,
    },
    workingHours: [workHours],
  },
  //ovdje treba nadodati tip podatka za spremat rezervacije, nekako u formatu kalendara, za to jos trazim rjesenja
  //takodjer razmotriti da li ce se salon koristiti podatak sam za sebe ili ce se preko zaposlenika pratiti
  //recenzije isto moraju bit, kombinacija komentara i brojevnih ocjena, array vjerovatno pa se racuna prosjek -> ako bude princip
  //sa zapolenicima onda treba i mogucnost njih ocjenit i napravit da se to racuna u konacnu ocjenu

  {
    timestamps: true,
  }
);

//Ovako se radi model, schema je prosireni model ina way, prvi arg je ime a drugi je struktura
const Salon = mongoose.model("Salon", SalonSchema);

module.exports = Salon;
