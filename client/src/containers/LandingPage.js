import React from "react";
import {
  Jumbotron,
  Button,
  Container,
  Card,
  CardDeck,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import search from "../search.png";
import review from "../review.png";
import booking from "../booking.png";

const LandingPage = () => {
  return (
    <>
      <Jumbotron bg="light" className="mb-0 pb-6 ">
        <Container>
          <Row>
            <Col sm={6}>
              <h1 className="display-4 pt-5 pb-3 text-info">
                A 'ko tebe šiša?
              </h1>
              <p className="lead font-italic">
                Želite se ošišati no trenutni frizer vam je oduzeo centimetre
                koji su nepovratni? Na pravom ste mjestu. Pronađite svoj novi
                omiljeni salon u svega nekoliko klikova, jer dobra frizura pola
                je zdravlja.
              </p>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Container className="mt-0">
        <Card className="text-center pt-3" bg="light">
          <Card.Body>
            <Card.Title className="display-4">Zašto Frizz.hr?</Card.Title>
            <Card.Text className="py-4 text-muted lead">
              Iskusite brojne pogodnosti uz brz i jednostavan <i>online</i>{" "}
              pristup frizerskim salonima diljem zemlje
            </Card.Text>

            <CardDeck>
              <Card>
                <Card.Header>
                  <Card.Img variant="top" src={search} className=" w-50 p-3 " />
                </Card.Header>

                <Card.Body>
                  <Card.Title className="text-dark">
                    Pametno pretraživanje
                  </Card.Title>
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
                  <Card.Title className="text-dark">
                    Rezervacija termina
                  </Card.Title>
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
                  <Card.Title className="text-dark">
                    Ocjenjivanje salona i/ili frizera
                  </Card.Title>
                  <Card.Text className="text-muted">
                    Pomognite ostalim korisnicima da odaberu najbolje salone
                    ostavljajući pozitivne ili negativne recenzije, uz mogućnost
                    specificiranja frizera/ke.
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardDeck>
            <div id="reg" name="#reg">
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for 'lorem
                ipsum' will uncover many web sites still in their infancy.
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose (injected humour and the like).
              </p>
            </div>
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
