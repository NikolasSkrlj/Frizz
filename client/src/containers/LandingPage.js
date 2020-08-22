import React from "react";
import { Jumbotron, Button, Container, Card, CardDeck } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa";
import search from "../search.png";
import review from "../review.png";
import booking from "../booking.png";

const LandingPage = () => {
  return (
    <>
      <Jumbotron bg="light" className="mb-0">
        <Container>
          <h1 className="display-4 py-3">
            Dobrodošli na moje skromne stranice
          </h1>
          <p className="lead">
            Pronađite svog novog omiljenog frizera u svega nekoliko klikova.
            Ovdje treba ici neka pozadinska slika sa opacity 0.5 il tako nes.
            Linkovi za registraciju jos ne rade to ce biti medju zadnjim
            koracima to je ez
          </p>

          <p>
            <Button
              variant="info"
              as={Link}
              to="/user"
              className="mx-2 my-2 justify-content-sm-center"
            >
              Registriraj svoj salon
            </Button>
            <Button variant="secondary">Registriraj se kao korisnik</Button>
          </p>
        </Container>
      </Jumbotron>
      <Container className="mt-0">
        <Card className="text-center pt-3" bg="light">
          <Card.Body>
            <Card.Title className="display-4">Zašto Frizz.hr?</Card.Title>
            <Card.Text className="py-4 text-muted lead">
              Iskusite brojne pogodnosti uz brz i jednostavan <i>online</i>{" "}
              pristup frizerskim salonima diljem zemlje.
            </Card.Text>

            <CardDeck>
              <Card>
                <Card.Header>
                  <Card.Img variant="top" src={search} className=" w-50 p-3 " />
                </Card.Header>

                <Card.Body>
                  <Card.Title>Pametno pretraživanje</Card.Title>
                  <Card.Text className="text-muted">
                    Pronađite salon po vašem ukusu, ovisno o lokaciji, prema
                    tipovima termina i njihovim cijenama, sortirajte s obzirom
                    na recenzije drugih korisnika itd.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Img variant="top" src={booking} className="w-50 p-3 " />
                </Card.Header>

                <Card.Body>
                  <Card.Title>Rezervacija termina</Card.Title>
                  <Card.Text className="text-muted">
                    Izbjegnite mukotrpne pozive i dogovaranja za termin.
                    Izaberite salon, provjerite koji su termini slobodni i
                    rezervirajte.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Img variant="top" src={review} className=" w-50 p-3 " />
                </Card.Header>

                <Card.Body>
                  <Card.Title>Ocjenjivanje salona i/ili frizera</Card.Title>
                  <Card.Text className="text-muted">
                    Pomognite ostalim korisnicima da odaberu najbolje salone
                    ostavljajući pozitivne ili negativne recenzije, uz mogućnost
                    specificiranja frizera/ke.
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardDeck>
          </Card.Body>
          <div>
            {/* zgob icona treba dati im credit, to ce bit u footeru.
             */}
            Icons made by{" "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>
            ,{" "}
            <a
              href="https://www.flaticon.com/authors/photo3idea-studio"
              title="photo3idea_studio"
            >
              photo3idea_studio
            </a>
            , and{" "}
            <a href="https://icon54.com/" title="Pixel perfect">
              Pixel perfect
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </Card>
      </Container>
    </>
  );
};
export default LandingPage;
