const mongoose = require("mongoose");

const connectionURL = process.env.MONGO_URI;
mongoose.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to database!");
  }
);
