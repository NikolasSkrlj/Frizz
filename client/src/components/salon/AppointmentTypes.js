import React, { useState, useContext, useEffect } from "react";
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
  DropdownButton,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AppointmentType from "./AppointmentType";
import AddAppointmentType from "./AddAppointmentType";

const AppointmentTypes = () => {
  const { authToken } = useContext(GlobalContext);

  // const [salon, setSalon] = useState({});
  const [appointmentTypes, setAppointmentTypes] = useState([]);

  const [sortOption, setSortOption] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Sortiraj");

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [addAppTypeToggle, setAddAppTypeToggle] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      case "S dužim trajanjem":
        setSortOption({ option: "duration", isAsc: false });
        break;
      case "S kraćim trajanjem":
        setSortOption({ option: "duration", isAsc: true });
        break;
      case "S većom cijenom":
        setSortOption({ option: "price", isAsc: false });
        break;
      case "S manjom cijenom":
        setSortOption({ option: "price", isAsc: true });
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
          `/hairsalon/get_appointmentTypes?sortBy=${sortOption.option}_${
            sortOption.isAsc ? "asc" : "desc"
          }`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setAppointmentTypes(res.data.appointmentTypes);
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
  }, [sortOption, isUpdated]);

  /* useEffect(() => {
    setSalon(JSON.parse(sessionStorage.getItem("salon")));
  }, []); */

  return (
    <Card style={{ minHeight: "100vh" }}>
      <Card.Header className="d-flex">
        <h3 className="align-self-start">Vrste termina</h3>
      </Card.Header>

      <Card.Body>
        <div>
          <div className="d-flex">
            <Button
              variant="info"
              onClick={() => setAddAppTypeToggle(!addAppTypeToggle)}
            >
              Dodaj <FaPlus className="ml-2" />
            </Button>

            <DropdownButton
              as={ButtonGroup}
              id="dropdown-basic-button"
              title={sortButtonLabel}
              variant="outline-secondary"
              className="ml-auto"
              size="sm"
            >
              <Dropdown.Item onClick={() => handleSortClick("S većom cijenom")}>
                S većom cijenom
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortClick("S manjom cijenom")}
              >
                S manjom cijenom
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortClick("S dužim trajanjem")}
              >
                S dužim trajanjem
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortClick("S kraćim trajanjem")}
              >
                S kraćim trajanjem
              </Dropdown.Item>
            </DropdownButton>
          </div>
          {addAppTypeToggle && (
            <AddAppointmentType
              updateAppTypes={setIsUpdated}
              toggleAdd={() => setAddAppTypeToggle(!addAppTypeToggle)}
            />
          )}

          <hr />
        </div>
        {isLoading ? (
          <div className="text-center text-muted justify-content-center">
            <h6 className="pb-2">...Učitavanje vrsta termina...</h6>
            <Spinner animation="border" variant="info" />
          </div>
        ) : fetchSuccess ? (
          appointmentTypes.length ? (
            appointmentTypes.map((at) => {
              return (
                <Row className="my-2" key={at._id}>
                  <Col xs={12}>
                    <AppointmentType
                      appointmentType={at}
                      updateAppTypes={setIsUpdated}
                    />
                  </Col>
                </Row>
              );
            })
          ) : (
            <h6 className="text-muted text-center">
              Trenutno nema upisanih vrsta termina.
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

export default AppointmentTypes;
