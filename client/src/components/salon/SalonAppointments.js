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

const SalonAppointments = () => {
  const { authToken } = useContext(GlobalContext);

  const [salon, setSalon] = useState({});
  const [searchDate, setSearchDate] = useState(new Date());
  const [sortOption, setSortOption] = useState({
    option: "appointmentDate",
    isAsc: true,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Sortiraj");

  const [filterButtonLabel, setFilterButtonLabel] = useState("Filtriraj");
  const [filter, setFilter] = useState("all");

  const [appointments, setAppointments] = useState([]);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  registerLocale("hr", hr);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleDateChange = (date) => {
    setSearchDate(new Date(date.setHours(18, 0, 0)));
  };

  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      case "Najnoviji":
        setSortOption({ option: "updatedAt", isAsc: false });
        break;
      case "Najstariji":
        setSortOption({ option: "updatedAt", isAsc: true });
        break;

      default:
        return;
    }
  };

  useEffect(() => {
    setFetchSuccess(false);
    setIsLoading(true);
    try {
      const getData = async () => {
        const res = await axios.get(
          `/hairsalon/get_appointments?searchDate=${searchDate.toISOString()}&filter=${filter}&sortBy=${
            sortOption.option
          }_${sortOption.isAsc ? "asc" : "desc"}`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setAppointments(res.data.appointments);
        setFetchSuccess(true);
        setIsLoading(false);
      };
      getData();
    } catch (err) {
      if (err.response) {
        setFetchSuccess(false);
        setIsLoading(false);
      }
    }
  }, [sortOption, filter, searchDate, isUpdated]);

  useEffect(() => {
    setSalon(JSON.parse(sessionStorage.getItem("salon")));
  }, []);

  const handleConfirmClick = async (action, appointmentId) => {
    setMessageToggled(false);
    setMessage("");

    try {
      const res = await axios.post(
        `/hairsalon/confirm_appointment`,
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
          setIsUpdated(!isUpdated);
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

  const DateInput = ({ onClick }) => {
    return (
      <div>
        <Button disabled variant="light" style={{ pointerEvents: "none" }}>
          {new Date(searchDate).toLocaleDateString()}
        </Button>

        <Button variant="outline-info" onClick={onClick}>
          <FaCalendarAlt />
        </Button>
      </div>
    );
  };

  return (
    <Card style={{ minHeight: "100vh" }}>
      <Card.Header className="d-flex">
        <h3 className="align-self-start"> Termini</h3>
      </Card.Header>

      <Card.Body>
        <div>
          <Row className="d-flex">
            <Col sm={6} className="align-content-stretch">
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={filter === "all"}
                  onChange={() => setFilter("all")}
                >
                  Svi
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={filter === "onHold"}
                  onChange={() => setFilter("onHold")}
                >
                  Za potvrdu
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={filter === "active"}
                  onChange={() => setFilter("active")}
                >
                  Aktivni
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={filter === "archived"}
                  onChange={() => setFilter("archived")}
                >
                  Arhivirani
                </ToggleButton>
              </ButtonGroup>
            </Col>
            <Col sm={6} className="my-2">
              <h5>
                Na dan:
                <DatePicker
                  selected={searchDate}
                  onChange={handleDateChange}
                  customInput={<DateInput />}
                  locale="hr"
                  //  minDate={new Date()}
                  closeOnScroll
                  dateFormat="Pp"
                />
              </h5>
            </Col>
          </Row>

          <hr />
          <div>
            <h4 className="my-4 d-flex">
              {filter === "active"
                ? "Aktivni termini"
                : filter === "archived"
                ? "Arhivirani termini"
                : filter === "onHold"
                ? "Na čekanju za potvrdu"
                : "Svi termini"}
              <div className="ml-auto">
                <DropdownButton
                  as={ButtonGroup}
                  id="dropdown-basic-button"
                  title={sortButtonLabel}
                  variant="outline-secondary"
                  className="ml-auto"
                  size="sm"
                >
                  <Dropdown.Item onClick={() => handleSortClick("Najnoviji")}>
                    Najnoviji
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortClick("Najstariji")}>
                    Najstariji
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </h4>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center text-muted justify-content-center">
            <h6 className="pb-2">...Učitavanje termina...</h6>
            <Spinner animation="border" variant="info" />
          </div>
        ) : fetchSuccess ? (
          appointments.length ? (
            appointments.map((app) => {
              return (
                <Row className="my-2" key={app._id}>
                  <Col xs={12}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="text-info d-flex">
                          {app.appointmentType.name}
                        </Card.Title>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <b className="text-dark">Korisnik: </b>
                            {app.userId.name}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Telefon: </b>

                            <a href={`tel:${app.userId.phone}`}>
                              {app.userId.phone}
                            </a>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Datum termina: </b>
                            {new Date(app.appointmentDate).toLocaleDateString()}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Vrijeme termina: </b>
                            {`${app.startTime.hours.toLocaleString(undefined, {
                              minimumIntegerDigits: 2,
                              useGrouping: false,
                            })}:${app.startTime.minutes.toLocaleString(
                              undefined,
                              {
                                minimumIntegerDigits: 2,
                                useGrouping: false,
                              }
                            )}`}
                          </ListGroup.Item>

                          <ListGroup.Item>
                            <b className="text-dark">
                              Datum i vrijeme kreiranja rezervacije:{" "}
                            </b>

                            <span>
                              {new Date(app.createdAt).toLocaleString()}
                            </span>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Trajanje: </b>
                            {app.appointmentType.duration} min
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Cijena: </b>
                            {app.appointmentType.price} kn
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Frizer: </b>
                            {app.hairdresserId
                              ? app.hairdresserId.name
                              : "Neodređen"}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Status: </b>
                            {app.completed ? (
                              <b className="text-warning">arhiviran</b>
                            ) : app.confirmed ? (
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

                        {!app.completed && !app.confirmed && (
                          <>
                            <hr />
                            <Row>
                              <Col>
                                <Button
                                  className="mx-1"
                                  variant="success"
                                  block
                                  onClick={() => {
                                    handleConfirmClick("confirm", app._id);
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
                                    handleConfirmClick("reject", app._id);
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
                  </Col>
                </Row>
              );
            })
          ) : (
            <h6 className="text-muted text-center">
              Trenutno nema termina na zadani datum.
            </h6>
          )
        ) : (
          <Alert variant="danger">
            <Alert.Heading>Došlo je do pogreške!</Alert.Heading>
            <p>Molimo osvježite stranicu!</p>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default SalonAppointments;
