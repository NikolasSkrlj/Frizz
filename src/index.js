// ovo odvajamo ovako zbog supertest modula koji koristi app za testiranje express aplikacija, ali sam postavi port tkda ne treba app.listen
const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port ", process.env.PORT);
});
