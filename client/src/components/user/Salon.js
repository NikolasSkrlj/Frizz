import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import axios from "axios";
import {
  Card,
  Nav,
  Button,
  ListGroup,
  Tab,
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Badge,
} from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

const Salon = ({ salonData }) => {
  const { authToken } = useContext(GlobalContext);

  //za datepicker
  const [appointmentDate, setAppointmentDate] = useState(Date.now());
  const [dateChecked, setDateChecked] = useState(false);
  const [freeTimes, setFreeTimes] = useState([]);

  //za odabir termina
  const [appointmentTypeSelect, setAppointmentTypeSelect] = useState("Odaberi");
  const [appointmentTypeId, setAppointmentTypeId] = useState("");

  const {
    id,
    name,
    email,
    address,

    gallery,
    workingHours,
    appointmentTypes,
    hairdressers,

    phone,
  } = salonData;

  // za kalendar da je na hrvatskom
  registerLocale("hr", hr);

  const handleDateChange = async (date) => {
    setAppointmentDate(date);
  };

  const handleTypeSelect = (e, name) => {
    setAppointmentTypeSelect(name);
    setAppointmentTypeId(e.target.getAttribute("apptypid")); // ovako se dohvaca custom props koje zadajemo DOM nodeovima
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
  /* 
  useEffect(() => {
      const getData = async () => {

    } 
    console.log(id);
  }, [appointmentDate]); */

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
                  <a href="#">vidi na karti</a>
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
              <Button variant="info" href="#">
                Go somewhere
              </Button>
            </Card.Body>{" "}
          </Tab.Pane>
          <Tab.Pane eventKey="gallery">
            <Card.Body>heheasjhadbjashjbheheheh</Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="reserve">
            <Card.Body>
              <Row>
                <Col sm={4} className="mb-3">
                  <h5 className="mb-3">Datum termina</h5>
                  <DatePicker
                    selected={appointmentDate}
                    onChange={handleDateChange}
                    customInput={<DateInput />}
                    locale="hr"
                    minDate={new Date()}
                    closeOnScroll
                    dateFormat="Pp"
                  />
                </Col>
                <Col sm={4}>
                  <h5 className="mb-3">Vrsta termina</h5>
                  <DropdownButton
                    id="dropdown-item-button"
                    title={appointmentTypeSelect}
                    variant="outline-info"
                  >
                    {appointmentTypes.map((app) => {
                      return (
                        <Dropdown.Item
                          as="button"
                          key={app.id}
                          apptypid={app.id}
                          className="d-flex"
                          onClick={(e) => handleTypeSelect(e, app.name)} //prosljedjujemo event object kako bi dosli do id atributa
                        >
                          <div>{app.name}</div>
                          <div className="ml-auto">
                            <div className="border-left my-0 py-0 d-inline mx-2 "></div>
                            <Badge variant="info">{app.price} kn</Badge>
                          </div>
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </Col>
              </Row>
            </Card.Body>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Card>
  );
};

export default Salon;
