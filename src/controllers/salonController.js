const Salon = require("../models/Salon");

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
  const salon = new Salon({
    name: "Elida",
    address: "Lupoglav",
    workingHours: wk,
  });
  await salon.save((err) => {
    if (err) {
      res.status(500).send({ message: "Dogodila se pogreška" });
    }
    res.send({ salon, message: "Salon uspjesno unesen!" });
  });
};
