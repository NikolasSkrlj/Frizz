const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");

const app = express();
//importing salon router
const salonRouter = require("./routes/salonRouter");
app.use(salonRouter);
app.use(cors());
app.use(express.json());

module.exports = app;
