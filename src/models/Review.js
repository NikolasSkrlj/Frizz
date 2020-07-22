const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: String,
      enum: ["registered", "anon"], // recenzije moze dati registrirani i anoniman, ako je reg onda se njemu sprema u bazu
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, //psotojat ce ako je user reg
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    hairdresserId: {
      type: mongoose.Schema.Types.ObjectId, //ako se ocjenjuje samo salon bit ce null inace
      default: null,
    },
    comment: {
      // ovdje mozda postaviti neki time formater, treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
      type: String,
      default: "",
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

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
