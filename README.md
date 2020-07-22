# Zavrsni-rad

Node.js i React.js aplikacija za pametno pretraživanje frizerskih salona u Hrvatskoj po različitim kriterijima, mogućnost online rezervacije termina i ocjenjivanje salona.

# Teme za raspravu / To do's

- Previse nested schemas -> treba razdvojiti u posebne modele i spojiti preko id-a. Tako kasnije dobivamo na funkcionalnosti sortiranja i pretrazivanja = DONE
- napraviti users i admins modele: useri ce bit korisnici a admins vlasnici salona. Samo je jedan racun preko kojega se moze dodavati frizere i uredjivati podatke itd. = TODO
- format kalendara je tesko napraviti za spremiti u bazu: spremat ce se samo termini i na frontendu kroz date-picker ce se znati koji su termini slobodni.
  Jedan use case: odabere se neki datum, napravi se upit za taj datum koji su termini slobodni(sati) -> to ce se na frontendu racunat
