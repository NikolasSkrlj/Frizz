const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "HairSalon",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hairdresserId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Hairdresser",
    },
    appointmentType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "AppointmentType",
    },
    appointmentDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    startTime: {
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
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
