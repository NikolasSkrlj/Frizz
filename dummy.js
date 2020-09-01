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
/* const reviews = [
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
 */
const {
  getWeeksInMonth,
  getDaysInMonth,
  getISOWeek,
  getWeekOfMonth,
  isWithinInterval,
  areIntervalsOverlapping,
  getOverlappingDaysInIntervals,
} = require("date-fns");

/* //daje koliko je tjedana u mjesecu s pocetkom na ponedjeljak
let result = getWeeksInMonth(new Date(), { weekStartsOn: 1 });
console.log(result);

// koliko dana u mjesecu
let tmp = getDaysInMonth(new Date());
console.log(tmp);

//koji je index trenutnog tjedna (datuma)
let tmp2 = getWeekOfMonth(new Date(), {
  weekStartsOn: 1,
});
console.log(tmp2);

console.error("yo im not havin a good time");
 */
console.log(
  /* isWithinInterval(new Date("2020-08-26T20:00:00.000+00:00"), {
    start: new Date("2020-08-26T19:00:00.000+00:00"),
    end: new Date("2020-08-26T20:00:00.000+00:00"),
  }), */
  areIntervalsOverlapping(
    {
      start: new Date("2020-08-26T11:50:00.000+00:00"),
      end: new Date("2020-08-26T12:45:00.000+00:00"),
    },
    {
      start: new Date("2020-08-26T11:45:00.000+00:00"),
      end: new Date("2020-08-26T12:45:00.000+00:00"),
    }
  )
);
console.log(
  (new Date("2020-08-26T11:40:00.000+00:00") -
    new Date("2020-08-26T11:00:00.000+00:00")) /
    (1000 * 60)
);
/* const test1 = new Date();
const test2 = new Date("2020-8-26");
const test3 = new Date("2020-8-26");

console.log(test1); // vraca 2020-08-24T13:26:51.694Z
console.log(test2); // vraca 2020-08-25T22:00:00.000Z -> ovo je ISO format

console.log(test1.toString()); // vraca Mon Aug 24 2020 15:26:51 GMT+0200 (GMT+02:00)
console.log(test2.toLocaleDateString("hr-HR")); // vraca 2020-8-26
console.log(test2.toISOString()); // vraca 2020-08-25T22:00:00.000Z

const back1 = new Date(test1.toString());
const back2 = new Date("26. 08. 2020.");

console.log(back1);
console.log(back2);

const tmp = {};
if (tmp) {
  console.log("nije prazan");
} else console.log("prazan");
console.log({} == null); */

/* console.log({});
console.log({} == null);

const test = new Date();
console.log(test, test.toISOString());
 */
const toIsoString = (date) => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      var norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
};

const test = new Date();
console.log(test);
console.log(test.toISOString());
console.log(toIsoString(test));
