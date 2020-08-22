import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import { SalonContext } from "../../contexts/SalonContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import axios from "axios";
import { Card, Nav, Button, ListGroup, Tab, Form } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
//mozda to spremiti podatke nakon fetcha u context koji okruzuje dashboard da se ne mora loadat -> nah nema smisla bas
const Salon = ({ salonData }) => {
  const { authToken } = useContext(GlobalContext);
  const [appointmentDate, setAppointmentDate] = useState(Date.now());

  registerLocale("hr", hr);
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
  const handleDateChange = (date) => {
    setAppointmentDate(date);
  };

  const DateInput = ({ onClick }) => {
    return (
      <div>
        <Button disabled variant="light" style={{ pointerEvents: "none" }}>
          {new Date(appointmentDate).toLocaleDateString()}
        </Button>
        <Button variant="outline-info" onClick={onClick}>
          <FaCalendarAlt />
        </Button>
      </div>
    );
  };

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
    <Card className="mb-3">
      <Tab.Container id="left-tabs-example" defaultActiveKey="about">
        <Card.Header className="bg-info text-white lead">{name}</Card.Header>
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
              <Button variant="info" href="#reserve">
                Go somewhere
              </Button>
            </Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="wh">
            <Card.Body id="wh">
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
              <Button variant="info" href="#reserve">
                Go somewhere
              </Button>
            </Card.Body>{" "}
          </Tab.Pane>
          <Tab.Pane eventKey="gallery">
            <Card.Body>heheasjhadbjashjbheheheh</Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="reserve">
            <Card.Body>
              <h5 className="mb-4">Odaberi datum termina</h5>
              <DatePicker
                selected={appointmentDate}
                onChange={handleDateChange}
                customInput={<DateInput />}
                locale="hr"
              />
            </Card.Body>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Card>
  );
};

export default Salon;
