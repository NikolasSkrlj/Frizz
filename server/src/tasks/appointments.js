const cron = require("node-cron");
const Appointment = require("../models/Appointment");

//provjerava ako je prosao datum termina i stavlja ga kao arhiviranoh(completed = true)
//svakih 20 minuta
const checkAppointments = cron.schedule("20 * * * *", async () => {
  const appointments = await Appointment.find({ completed: false });
  for (const appointment of appointments) {
    const now = new Date();
    if (now > appointment.appointmentDate) {
      appointment.completed = true;
      await appointment.save();
    }
  }
});

module.exports = checkAppointments;
