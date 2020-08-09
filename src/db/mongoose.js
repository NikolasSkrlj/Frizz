const mongoose = require("mongoose");

const connectionURL = process.env.MONGO_URI;
console.log(process.env.PORT);
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
