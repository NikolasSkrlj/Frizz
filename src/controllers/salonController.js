const Hair_Salon = require("../models/Hair_Salon");

module.exports.createSalon = async (req, res, next) => {
  const wk = [
    {
      index: 1,
      dayName: "ponedjeljak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 2,
      dayName: "utorak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 3,
      dayName: "srijeda",
      startWorktime: 14,
      endWorktime: 21,
    },
    {
      index: 4,
      dayName: "četvrtak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 5,
      dayName: "petak",
      startWorktime: 8,
      endWorktime: 16,
    },
    {
      index: 6,
      dayName: "subota",
      startWorktime: 14,
      endWorktime: 21,
    },
    {
      index: 7,
      dayName: "nedjelja",
      startWorktime: null,
      endWorktime: null,
    },
  ];
  const salon = new Hair_Salon({
    name: "Elida 4",
    address: {
      street: "Lupoglav 25c",
      postalCode: 52426,
      city: "Lupoglav",
    },
    email: "dada@haha.com",
    phone: "0981371388",
    workingHours: wk,
  });
  try {
    await salon.save();
    res.send({ success: true, salon, message: "Salon uspjesno unesen!" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Dogodila se pogreška", error: err });
  }
  /* ((err) => {
    if (err) {
      res.status(500).send({ message: "Dogodila se pogreška" });
    }
    res.send({ salon, message: "Salon uspjesno unesen!" });
  }); */
};

// testna ruta
module.exports.submitReview = async (req, res, next) => {
  const review = {
    userId: "5ed530936a6e0432bce70b64",
    rating: 3.5,
    comment: "A cuj moze i bolje",
  };

  try {
    const reviewed = await Hair_Salon.findOne({ _id: req.params.id });
    reviewed.reviews.push(review);
    const result = await reviewed.save();
    console.log(result);
    res.send({ success: true, message: "Review submited successfully!" });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Dogodila se pogreška", error: err });
  }
};
