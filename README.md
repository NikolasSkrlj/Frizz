# Zavrsni-rad

Node.js i React.js aplikacija za pametno pretraživanje frizerskih salona u Hrvatskoj po različitim kriterijima, mogućnost online rezervacije termina i ocjenjivanje salona.

# Bilješke

- Model salona ima svoj email i pass, i user ima svoj email pass -> odvojeni auth ali radi na isti princip
- Svaki frizer ima array recenzija pomocu kojih se racuna globalni rating.
- format kalendara je tesko napraviti za spremiti u bazu: spremat ce se samo termini i na frontendu kroz date-picker ce se znati koji su termini slobodni.
  Jedan use case: odabere se neki datum, napravi se upit za taj datum koji su termini slobodni(sati) -> to ce se na frontendu racunat
