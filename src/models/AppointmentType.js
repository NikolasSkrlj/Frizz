const mongoose = require("mongoose");

const appointmentTypeSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Types.ObjectId,
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
      type: Number,
      required: true,
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
