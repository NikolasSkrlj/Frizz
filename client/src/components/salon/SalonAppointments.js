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
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const SalonAppointments = () => {
  const { authToken } = useContext(GlobalContext);

  const [salon, setSalon] = useState({});
  const [searchDate, setSearchDate] = useState(new Date("2020-09-04"));
  const [sortOption, setSortOption] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Sortiraj");

  const [filterButtonLabel, setFilterButtonLabel] = useState("Filtriraj");
  const [filter, setFilter] = useState("archived");

  const [appointments, setAppointments] = useState([]);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  /* const [show, setShow] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
 */
  /* const handleClose = () => {
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
 */
  const handleFilterClick = (term) => {
    setFilterButtonLabel(term);
    switch (term) {
      case "Svi":
        setFilter("all");
        break;
      case "Aktivni":
        setFilter("active");
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
  }, [sortOption, filter]);

  useEffect(() => {
    setSalon(JSON.parse(sessionStorage.getItem("salon")));
  }, []);
  /* 
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
 */
  return (
    <Card>
      <Card.Header className="d-flex">
        <h3 className="align-self-start"> Termini</h3>
      </Card.Header>

      <Card.Body>
        <div>
          <div className="d-flex">
            <div className="mr-auto">
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={true}
                >
                  Na čekanju
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={false}
                >
                  Aktivni
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="info"
                  name="radio"
                  checked={false}
                >
                  Arhivirani
                </ToggleButton>
              </ButtonGroup>
            </div>

            <div className="ml-auto">
              {/*  <DropdownButton
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
                <Dropdown.Item onClick={() => handleFilterClick("Aktivni")}>
                  Aktivni
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Arhivirani")}>
                  Arhivirani
                </Dropdown.Item>
              </DropdownButton> */}
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
              : "Svi termini"}
          </h4>
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
                            ) : (
                              <b className="text-success">aktivan</b>
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
