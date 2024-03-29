const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");

const path = require("path");
const { globalPath } = require("./globalPath"); // jer inace ako je se koristi .. u pathu za build folder express ne dopusta
const app = express();

//importing routers
const salonRouter = require("./routes/salonRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cors());
//ovo mora biti iznad ovog ispod idk why al bez toga u productionu ne rade requesti get
app.use("/hairsalon", salonRouter);
app.use("/user", userRouter);

const checkAppointments = require("./tasks/appointments");

checkAppointments.start();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(globalPath, "../../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(globalPath, "../../client/build/index.html"));
  });
} else {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.post("/", function (req, res) {
  res.send({ message: "API is up and running :)" });
});

app.get("/", function (req, res) {
  res.send({ message: "API is up and running :)" });
});

module.exports = app;
