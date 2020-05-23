//ovime se spremaju mjeseci i njihovi dani u arrayove
//ideja: mora se moc odabrat termin tj datum kad bi se zeljelo doc na termin i sat u danu, naravno u rasponu radnog vremena

var d3 = require("d3-time");
let months = new Array();
for (let i = 0; i < 12; i++) {
  let daysNmbr = new Date(2020, i, 0).getDate();

  months.push(
    d3.timeDay.range(new Date(2020, i, 1), new Date(2020, i, daysNmbr + 3))
  );
}
console.log(months);
