//ovo koristimo da mozemo koristiti user auth u vise testova, za taskove i usere

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mm@gmail.com",
  password: "idkman213",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: "Nikolas",
  email: "nn@gmail.com",
  password: "idkmasdan213",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const setupDb = async () => {
  await User.deleteMany(); // moramo koristit await da osiguramo da se izvrsi prije nego krene dalje
  await new User(userOne).save(); //napravimo ovog usera za usluge logina i to
  await new User(userTwo).save(); //napravimo ovog usera za usluge logina i to
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDb,
};
