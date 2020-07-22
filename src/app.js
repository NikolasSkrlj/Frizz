const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");

const app = express();
//importing salon router
const salonRouter = require("./routes/salonRouter");

app.use(express.json());
app.use(cors());

app.use("/hairsalon", salonRouter);

module.exports = app;
