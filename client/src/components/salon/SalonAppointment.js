import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import {
  Card,
  Spinner,
  Button,
  Alert,
  Row,
  Col,
  ListGroup,
  Dropdown,
  Modal,
  DropdownButton,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

const SalonAppointments = ({ appointment, updateAppointments }) => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleConfirmClick = async (action, appointmentId) => {
    setMessageToggled(false);
    setMessage("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/hairsalon/confirm_appointment`,
        { appointmentId, action },
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        }
      );

      if (res.data.success) {
        setSubmitSuccess(true);
        setMessage(res.data.message);
        setMessageToggled(true);

        setTimeout(() => {
          updateAppointments((prev) => !prev);
          setMessage("");
          setMessageToggled(false);
        }, 2000);
      }
    } catch (err) {
      //ovdje treba provjera ako je kod specifican vratit poruku da user postoji
      if (err.response) {
        setSubmitSuccess(false);
        setMessage(err.response.data.message || "Došlo je do pogreške!");
        setMessageToggled(true);
      }
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="text-info d-flex">
          {appointment.appointmentType.name}
        </Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <b className="text-dark">Korisnik: </b>
            {appointment.userId.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Telefon: </b>

            <a href={`tel:${appointment.userId.phone}`}>
              {appointment.userId.phone}
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Datum termina: </b>
            {new Date(appointment.appointmentDate).toLocaleDateString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Vrijeme termina: </b>
            {`${appointment.startTime.hours.toLocaleString(undefined, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}:${appointment.startTime.minutes.toLocaleString(undefined, {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}`}
          </ListGroup.Item>

          <ListGroup.Item>
            <b className="text-dark">Datum i vrijeme kreiranja rezervacije: </b>

            <span>{new Date(appointment.createdAt).toLocaleString()}</span>
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Trajanje: </b>
            {appointment.appointmentType.duration} min
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Cijena: </b>
            {appointment.appointmentType.price} kn
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Frizer: </b>
            {appointment.hairdresserId
              ? appointment.hairdresserId.name
              : "Neodređen"}
          </ListGroup.Item>
          <ListGroup.Item>
            <b className="text-dark">Status: </b>
            {appointment.completed ? (
              <b className="text-warning">arhiviran</b>
            ) : appointment.confirmed ? (
              <b className="text-success">aktivan</b>
            ) : (
              <b className="text-danger">na čekanju</b>
            )}
          </ListGroup.Item>
        </ListGroup>
        {messageToggled && (
          <Alert variant={submitSuccess ? "success" : "danger"}>
            {message}
          </Alert>
        )}

        {!appointment.completed && !appointment.confirmed && (
          <>
            <hr />
            <Row>
              <Col>
                <Button
                  className="mx-1"
                  variant="success"
                  block
                  onClick={() => {
                    handleConfirmClick("confirm", appointment._id);
                  }}
                >
                  Potvrdi
                </Button>
              </Col>
              <Col>
                <Button
                  className="mx-2"
                  variant="danger"
                  block
                  onClick={() => {
                    handleConfirmClick("reject", appointment._id);
                  }}
                >
                  Odbaci
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default SalonAppointments;
