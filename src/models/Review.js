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
      ref: "User",
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
      ref: "Hairdresser",
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

  const salon = await HairSalon.findOne({ _id: review.salonId })
    .populate("reviews")
    .exec();

  const salonRatingSum = salon.reviews.reduce(
    (review1, review2) => {
      if (!review1 && !review2) {
        return { rating: 0 };
      }
      if (!review1) {
        return { rating: review2.rating };
      }
      if (!review2) {
        return { rating: review1.rating };
      }
      return { rating: review1.rating + review2.rating };
    },
    { rating: 0 }
  );

  let salonReviewsLength = salon.reviews.filter((review) => {
    return review !== null;
  }).length;

  //+ pretvara u brojcani tip variable
  salon.globalRating = +(salonRatingSum.rating / salonReviewsLength).toFixed(2);

  await salon.save(() => {
    console.log("Salon global rating updated!");
  });

  if (review.hairdresserId) {
    const hairdresser = await Hairdresser.findOne({ _id: review.hairdresserId })
      .populate("reviews")
      .exec();

    const hairdresserRatingSum = hairdresser.reviews.reduce(
      (review1, review2) => {
        if (!review1 && !review2) {
          return { rating: 0 };
        }
        if (!review1) {
          return { rating: review2.rating };
        }
        if (!review2) {
          return { rating: review1.rating };
        }
        return { rating: review1.rating + review2.rating };
      },
      { rating: 0 }
    );

    let hairdresserReviewsLength = hairdresser.reviews.filter((review) => {
      return review !== null;
    }).length;

    hairdresser.globalRating = +(
      hairdresserRatingSum.rating / hairdresserReviewsLength
    ).toFixed(2);

    await hairdresser.save((err) => {
      if (err) throw new Error(err);
      console.log("Haidresser global rating updated!");
    });
  }
};
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
