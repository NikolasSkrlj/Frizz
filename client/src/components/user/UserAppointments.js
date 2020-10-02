import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
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
  ButtonGroup,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const UserAppointments = () => {
  const { authToken } = useContext(GlobalContext);

  const [user, setUser] = useState({});

  const [sortOption, setSortOption] = useState({
    option: "updatedAt",
    isAsc: false,
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

  const [show, setShow] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleClose = () => {
    setShow(false);
    //ako je uspjesno unesena recenzija, pri zatvaranju modala se rerenderaju recenzije i prikaze se najnovija unesena recenzija prva
    if (submitSuccess) {
      setIsUpdated(!isUpdated);
      setMessage("");
      setMessageToggled(false);
      setSubmitSuccess(false);
    }
  };
  const handleShow = (action) => {
    setShow(true);
  };

  const handleFilterClick = (term) => {
    setFilterButtonLabel(term);
    switch (term) {
      case "Svi":
        setFilter("all");
        break;
      case "Aktivni":
        setFilter("active");
        break;
      case "Na čekanju":
        setFilter("onHold");
        break;
      case "Arhivirani":
        setFilter("archived");
        break;
      default:
        return;
    }
  };
  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      case "Najnovije":
        setSortOption({ option: "updatedAt", isAsc: false });
        break;
      case "Najstarije":
        setSortOption({ option: "updatedAt", isAsc: true });
        break;
      case "Po datumu termina uzlazno":
        setSortOption({ option: "appointmentDate", isAsc: true });
        break;
      case "Po datumu termina silazno":
        setSortOption({ option: "appointmentDate", isAsc: false });
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
          `/user/get_appointments?filter=${filter}&sortBy=${
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
  }, [sortOption, filter, isUpdated]);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const handleDeleteClick = async (appointmentId) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.delete(
        `/user/delete_appointment`,

        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          data: {
            appointmentId,
          },
        }
      );

      if (res.data.success) {
        setSubmitSuccess(true);
        setMessage(res.data.message);
        setMessageToggled(true);
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
    <Card style={{ minHeight: "100vh" }}>
      <Card.Header className="d-flex">
        <h3 className="align-self-start"> Termini</h3>
      </Card.Header>

      <Card.Body>
        <div>
          <div className="d-flex">
            <div className="ml-auto">
              <DropdownButton
                as={ButtonGroup}
                id="dropdown-basic-button"
                title={filterButtonLabel}
                variant="outline-info"
                className="ml-auto"
                size="sm"
              >
                <Dropdown.Item onClick={() => handleFilterClick("Svi")}>
                  Svi
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Na čekanju")}>
                  Na čekanju
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Aktivni")}>
                  Aktivni
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Arhivirani")}>
                  Arhivirani
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                as={ButtonGroup}
                id="dropdown-basic-button"
                title={sortButtonLabel}
                variant="outline-secondary"
                className="ml-auto"
                size="sm"
              >
                <Dropdown.Item onClick={() => handleSortClick("Najnovije")}>
                  Najnoviji
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortClick("Najstarije")}>
                  Najstariji
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortClick("Po datumu termina uzlazno")}
                >
                  Po datumu termina uzlazno
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortClick("Po datumu termina silazno")}
                >
                  Po datumu termina silazno
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          <hr />
          <h4 className="my-4">
            {filter === "active"
              ? "Aktivni termini"
              : filter === "archived"
              ? "Arhivirani termini"
              : filter === "onHold"
              ? "Termini na čekanju"
              : "Svi termini"}
          </h4>
          <p className="text-muted">
            Status termina može sadržavati sljedeće vrijednosti:
            <ul>
              <li>
                <span className="text-danger">na čekanju</span> - termin čeka na
                potvrdu od strane salona
              </li>
              <li>
                <span className="text-success">aktivan</span> - termin je
                potvrđen od strane salona
              </li>
              <li>
                <span className="text-warning">arhiviran</span> - termin je
                odbijen od strane salona ili je prošao datum termina
              </li>
            </ul>
          </p>
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
                <Row className="my-2">
                  <Col xs={12}>
                    <Card>
                      <Card.Body>
                        <Card.Title className="text-info d-flex">
                          {app.appointmentType.name}
                          {/* Ukoliko je termin jos aktivan tj jos nije dosao taj datum korisnik ga moze izbrisati */}
                          {!app.completed && (
                            <>
                              <Button
                                className="ml-auto"
                                variant="danger"
                                size="sm"
                                onClick={handleShow}
                              >
                                <FaTrash />
                              </Button>

                              <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header
                                  closeButton
                                  className="bg-info text-white"
                                >
                                  <Modal.Title>Izbriši termin</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="p-0">
                                  <Card>
                                    <Card.Body>
                                      <p className="m-4 text-center">
                                        Jeste li sigurni da želite izbrisati
                                        termin i poništiti rezervaciju?
                                      </p>
                                      <Alert
                                        variant={
                                          submitSuccess ? "success" : "danger"
                                        }
                                        show={messageToggled}
                                      >
                                        {message}
                                      </Alert>
                                      {submitSuccess && message ? (
                                        <Button
                                          variant="secondary"
                                          onClick={handleClose}
                                          block
                                        >
                                          Zatvori
                                        </Button>
                                      ) : (
                                        <Row>
                                          <Col>
                                            <Button
                                              variant="danger"
                                              onClick={handleClose}
                                              block
                                              className="mr-1"
                                            >
                                              Odustani
                                            </Button>
                                          </Col>
                                          <Col>
                                            <Button
                                              className="ml-1"
                                              variant="success"
                                              onClick={() =>
                                                handleDeleteClick(app._id)
                                              }
                                              block
                                            >
                                              Potvrdi
                                            </Button>
                                          </Col>
                                        </Row>
                                      )}
                                    </Card.Body>
                                  </Card>
                                </Modal.Body>
                              </Modal>
                            </>
                          )}
                        </Card.Title>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <b className="text-dark">Frizerski salon: </b>
                            {app.salonId.name}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <b className="text-dark">Adresa: </b>

                            {`${app.salonId.address.street}, ${app.salonId.address.postalCode} ${app.salonId.address.city}`}
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
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              );
            })
          ) : (
            <h6 className="text-muted text-center">Trenutno nemate termina.</h6>
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

export default UserAppointments;
