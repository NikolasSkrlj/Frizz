//ovime se spremaju mjeseci i njihovi dani u arrayove
//ideja: mora se moc odabrat termin tj datum kad bi se zeljelo doc na termin i sat u danu, naravno u rasponu radnog vremena

/* var d3 = require("d3-time");
let months = new Array();
for (let i = 0; i < 12; i++) {
  let daysNmbr = new Date(2020, i, 0).getDate();

  months.push(
    d3.timeDay.range(new Date(2020, i, 1), new Date(2020, i, daysNmbr + 3))
  );
}
console.log(months);
 */

// reduce() vjezba
const reviews = [
  {
    rating: 3.5,
    comment: "blabla",
  },
  null,
  {
    rating: 2.5,
    comment: "blabla",
  },
];
const ratingSum = reviews.reduce(
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
let length = reviews.filter((review) => {
  return review !== null;
}).length;

console.log("Global rating is: ", ratingSum.rating / length);
