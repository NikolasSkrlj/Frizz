const mongoose = require("mongoose");

const connectionURL = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
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

    //console.log(`DB connected`, conn);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
