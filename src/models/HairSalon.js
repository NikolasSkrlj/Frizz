const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const workingHoursSchema = new mongoose.Schema({
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
      type: String, //treba validacija
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // da nemogu dva emaila bit
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password can't contain the word password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
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
      type: [workingHoursSchema],
    },
    appointmentTypes: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "AppointmentType",
      },
    ],
    appointments: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Appointment",
      },
    ],
    hairdressers: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Hairdresser",
      },
    ],
    reviews: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review",
      },
    ],
    globalRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
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

HairSalonSchema.statics.findByCredentials = async (email, password) => {
  const salon = await HairSalon.findOne({ email: email });

  if (!salon) {
    throw new Error("Unable to login!");
  }

  const match = await bcrypt.compare(password, salon.password);
  if (!match) {
    throw new Error("Unable to login!");
  }
  return salon;
};

//metode se pozivaju nad instancima salona, statics su funckije
HairSalonSchema.methods.generateAuthToken = async function () {
  const salon = this;
  const token = jwt.sign({ _id: salon._id }, process.env.JWT_SECRET);
  salon.tokens = salon.tokens.concat({ token });
  await salon.save();
  return token;
};

// overwritali smo toJSON funkciju koju koristi mongoose pa ju ne treba uopce zvati pri slanju instance usera natrag.
HairSalonSchema.methods.toJSON = function () {
  const salon = this;

  const salonObj = salon.toObject(); // to koristimo da mozemo koristiti delete koji brise properties sa objekta;

  delete salonObj.password;
  delete salonObj.tokens;

  return salonObj;
};

//ovako se postavlja middleware, pre je prije dogadaja, post je poslije
// mora biti obicna funkcija ne arrow zbog this rijeci
// update user ne pokrece middleware, zato smo morali restrukturirat kod updatea
HairSalonSchema.pre("save", async function (next) {
  const salon = this;

  if (salon.isModified("password")) {
    salon.password = await bcrypt.hash(salon.password, 8);
  }
  next();
});

//Ovako se radi model, schema je prosireni model ina way, prvi arg je ime a drugi je struktura
const HairSalon = mongoose.model("HairSalon", HairSalonSchema);

module.exports = HairSalon;
