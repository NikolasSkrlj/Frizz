const express = require("express");
require("./db/mongoose.js");
const cors = require("cors");

const path = require("path");
const { globalPath } = require("../globalPath");
const app = express();

//importing routers
const salonRouter = require("./routes/salonRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(globalPath, "/client/build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join(globalPath, "/client/build/index.html"));
  });
} else {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use("/hairsalon", salonRouter);
app.use("/user", userRouter);

module.exports = app;
