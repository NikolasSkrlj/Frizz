import React from "react";
import {
  Jumbotron,
  Button,
  Container,
  Card,
  CardDeck,
  Row,
  Col,
  Nav,
  Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import UserRegForm from "../components/UserRegForm";
import SalonRegForm from "../components/SalonRegForm";

import search from "../search.png";
import review from "../review.png";
import booking from "../booking.png";

const LandingPage = () => {
  return (
    <>
      <Jumbotron className="mb-0 pb-6 ">
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
        <Card className="text-center pt-3 bg-white" bg="light">
          <Card.Body>
            <Card.Title className="display-4">Zašto Frizz.hr?</Card.Title>
            <Card.Text className="py-4 text-muted lead">
              Iskusite brojne pogodnosti uz brz i jednostavan <i>online</i>{" "}
              pristup frizerskim salonima diljem zemlje
            </Card.Text>

            <CardDeck className="mb-3">
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
                    specificiranja frizera.
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardDeck>
            <div id="reg" name="#reg">
              <Card>
                <Tab.Container id="left-tabs-example" defaultActiveKey="user">
                  <Card.Header>
                    <h2 class="text-center py-4 ">Registriraj se</h2>
                    <Nav variant="tabs" className="justify-content-center">
                      <Nav.Item>
                        <Nav.Link className="text-info " eventKey="user">
                          Kao korisnik
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="text-info" eventKey="salon">
                          Kao vlasnik salona
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Tab.Content>
                    <Tab.Pane eventKey="user">
                      <Card.Body>
                        <UserRegForm />
                      </Card.Body>
                    </Tab.Pane>
                    <Tab.Pane eventKey="salon">
                      <Card.Body>
                        <SalonRegForm />
                      </Card.Body>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card>
            </div>
          </Card.Body>
          <div>
            {/* zbog icona treba dati im credit, to ce bit u footeru.
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
