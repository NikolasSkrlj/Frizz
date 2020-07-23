const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HairSalon = require("../models/HairSalon");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); // ovaj drugi arg sluzi da gleda ako postoji jos taj token jer pri odjavi cemo ga brisati

    if (!user) {
      throw new Error();
    }

    //ako je user admin salona salje se i salon, iance se salje samo user u requestu
    req.token = token;
    req.user = user; //mozemo postavljat svoja polja u header

    if (user.isSalonAdmin) {
      const salon = await HairSalon.findOne({
        _id: user.salonId,
      });
      if (!salon) {
        res.status(500).send({
          success: false,
          message: "Salon s tim id-em nije pronadjen!",
        });
      }
      req.salon = salon;
    }
    next(); // sa next kontroliramo sta se desi ako prodje req il ne
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
