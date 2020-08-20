import React, { Component, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import { SalonContext } from "../../contexts/SalonContext";
import axios from "axios";
import { Card, Nav, Button, ListGroup, Tabs, Tab } from "react-bootstrap";

//mozda to spremiti podatke nakon fetcha u context koji okruzuje dashboard da se ne mora loadat -> nah nema smisla bas
const Salon = ({ salonData }) => {
  //const { authToken } = useContext(GlobalContext); ako treba za neke fetcheve

  /* useEffect(() => {
    const getRes = async () => {
      const res = await axios.get("http://localhost:4000/user/salons", {
        headers: {
          Authorization: authToken,
        },
      });
      console.log(res.data);
    };
    getRes();
  }, []); */
  const {
    name,
    email,
    address,
    externalLinks,
    gallery,
    workingHours,
    appointmentTypes,
    hairdressers,
    reviews,
    phone,
  } = salonData;

  return (
    <Card>
      <Tab.Container id="left-tabs-example" defaultActiveKey="about">
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link className="text-info " eventKey="about">
                O salonu
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="wh">
                Radno vrijeme
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="gallery">
                Galerija
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="reserve">
                Rezerviraj termin
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Tab.Content>
          <Tab.Pane eventKey="about">
            <Card.Body id="about">
              <Card.Title>{name}</Card.Title>
              <Card.Text>
                {name} je frizerski salon smješten u centru Buzeta gdje već
                nekoliko godina uspješno posluje i stoji građanima na
                raspolaganju.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4>Adresa</h4>
                  {Object.values(address).join(", ")}{" "}
                  <a href="">vidi na karti</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>E-mail</h4>
                  {email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>Telefon</h4>
                  {phone}
                </ListGroup.Item>
              </ListGroup>
              <Button variant="info">Go somewhere</Button>
            </Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="wh">Ovo je test </Tab.Pane>
          <Tab.Pane eventKey="gallery">heheasjhadbjashjbheheheh</Tab.Pane>
          <Tab.Pane eventKey="reserve">hehehehehe34234h</Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Card>
  );
};

export default Salon;
