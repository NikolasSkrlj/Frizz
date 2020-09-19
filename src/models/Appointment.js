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
