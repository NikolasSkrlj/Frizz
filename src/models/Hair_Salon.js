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

const appointmentTypes = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    // ovdje mozda postaviti neki time formater, treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
    type: Number,
    required: true,
  },
});

const appointment = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    hairdresserId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    appointmentType: {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      duration: {
        // treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
        // u minutama najbolje
        type: Number,
        required: true,
      },
    },
    appointmentDate: {
      type: Date,
    },
    startTime: {
      // ovo je prototip, mozda da bude type Date objekt vidjet cu jos sta se koristi
      hours: {
        type: Number,
        required: true,
        min: 6,
        max: 22,
      },
      minutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59,
      },
    },
    endTime: {
      hours: {
        type: Number,
        required: true,
        min: 6,
        max: 22,
      },
      minutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59,
      },
    },
  },
  {
    timestamps: true,
  }
);
const review = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", // ovo ce bit referenca na user model
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    // ovdje mozda postaviti neki time formater, treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
    type: String,
    default: "",
  },
});

// GLAVNA SCHEMA
const Hair_SalonSchema = new mongoose.Schema(
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
    workingHours: {
      type: [workHours],
    },
    appointmentTypes: {
      type: [appointmentTypes],
      default: [],
    },
    appointments: {
      type: [appointment],
      default: [],
    },
    reviews: {
      type: [review],
      default: [],
    },
  },
  //ovdje treba nadodati tip podatka za spremat rezervacije, nekako u formatu kalendara, za to jos trazim rjesenja
  //recenzije isto moraju bit, kombinacija komentara i brojevnih ocjena, array vjerovatno pa se racuna prosjek -> ako bude princip
  //sa zapolenicima onda treba i mogucnost njih ocjenit i napravit da se to racuna u konacnu ocjenu

  {
    timestamps: true,
  }
);

//Ovako se radi model, schema je prosireni model ina way, prvi arg je ime a drugi je struktura
const Hair_Salon = mongoose.model("Hair_Salon", Hair_SalonSchema);

module.exports = Hair_Salon;
