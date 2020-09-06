const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    phone: {
      type: String, //treba validacija
      /* ne radi kako treba  
      validate(value) {
        
        if (!validator.isMobilePhone(value, ["hr-HR"])) {
          throw new Error("Unesite valjani telefonski broj");
        }
      }, */
    },
    gender: {
      type: String,
      enum: ["M", "Ž"],
      default: "M",
    },
    //sve dostupne properties mozemo vidjeti na mongoose -> schema types
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // da ne mogu dva emaila bit
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
    profilePic: {
      type: Buffer,
    },
    reviews: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review",
      },
    ],
    appointments: [
      {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//custom metode za nas model User
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Unable to login!");
  }
  return user;
};

//metode se pozivaju nad instancima usera, statics su funckije
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// overwritali smo toJSON funkciju koju koristi mongoose pa ju ne treba uopce zvati pri slanju instance usera natrag.
userSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject(); // to koristimo da mozemo koristiti delete koji brise properties sa objekta;

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

//ovako se postavlja middleware, pre je prije dogadaja, post je poslije
// mora biti obicna funkcija ne arrow zbog this rijeci
// update user ne pokrece middleware, zato smo morali restrukturirat kod updatea
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Ovako se radi model, schema je prosireni model ina way, prvi arg je ime a drugi je struktura
const User = mongoose.model("User", userSchema);

module.exports = User;
