const mongoose = require("mongoose");
const HairSalon = require("./HairSalon");
const Hairdresser = require("./Hairdresser");

const reviewSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, //psotojat ce ako je user reg
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    hairdresserId: {
      type: mongoose.Schema.Types.ObjectId, //ako se ocjenjuje samo salon bit ce null inace
      default: null,
    },
    comment: {
      // ovdje mozda postaviti neki time formater, treba vidjet u kojem rasponu mogu bit trajanja(30 min visekratnik mozda)
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

reviewSchema.methods.updateRatings = async function () {
  const review = this;
  console.log(review.toObject());

  const salon = await HairSalon.findOne({ _id: review.salonId })
    .populate("reviews")
    .exec();

  const ratingSum = salon.reviews.reduce(
    (review1, review2) => {
      return { rating: review1.rating + review2.rating };
    },
    { rating: 0 }
  );

  salon.globalRating = ratingSum.rating / salon.reviews.length;

  await salon.save(() => {
    console.log("Salon global rating updated!");
  });

  if (review.hairdresserId) {
    const hairdresser = await Hairdresser.findOne({ _id: review.hairdresserId })
      .populate("reviews")
      .exec();

    const ratingSum = hairdresser.reviews.reduce((review1, review2) => {
      return { rating: review1.rating + review2.rating };
    });

    hairdresser.globalRating = ratingSum.rating / hairdresser.reviews.length;

    await hairdresser.save(() => {
      console.log("Hairdresser global rating updated!");
    });
  }
};
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
