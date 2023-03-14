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
import SalonAppointment from "./SalonAppointment";

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
          `${
            process.env.REACT_APP_API_URL
          }/hairsalon/get_appointments?searchDate=${searchDate.toISOString()}&filter=${filter}&sortBy=${
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
                <Row className="my-2" key={app._id}>
                  <Col xs={12}>
                    <SalonAppointment
                      appointment={app}
                      updateAppointments={setIsUpdated}
                    />
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
