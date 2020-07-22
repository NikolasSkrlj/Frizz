const mongoose = require("mongoose");

const appointmentTypeSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      // ovdje mozda postaviti neki time formater, treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
      // najbolje u minutama da se unosi
      type: Number,
      required: true,
    },
    intendedGender: {
      type: String,
      enum: ["M", "Ž"],
      default: "M",
    },
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
const AppointmentType = mongoose.model(
  "AppointmentType",
  appointmentTypeSchema
);
module.exports = AppointmentType;
