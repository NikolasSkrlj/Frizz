const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

//importing routers
const salonRouter = require("./routes/salonRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/hairsalon", salonRouter);
app.use("/user", userRouter);

module.exports = app;
