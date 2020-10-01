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
import Hairdresser from "./Hairdresser";
import AddHairdresser from "./AddHairdresser";

const Hairdressers = () => {
  const { authToken } = useContext(GlobalContext);

  // const [salon, setSalon] = useState({});
  const [hairdressers, setHairdressers] = useState({});

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

  const [addHairdresserToggle, setAddHairdresserToggle] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      /* case "Najnovije":
        setSortOption({ option: "updatedAt", isAsc: false });
        break;
      case "Najstarije":
        setSortOption({ option: "updatedAt", isAsc: true });
        break; */
      case "S većom ocjenom":
        setSortOption({ option: "globalRating", isAsc: false });
        break;
      case "S manjom ocjenom":
        setSortOption({ option: "globalRating", isAsc: true });
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
          `/hairsalon/get_hairdressers?sortBy=${sortOption.option}_${
            sortOption.isAsc ? "asc" : "desc"
          }`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setHairdressers(res.data.hairdressers);
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
        <h3 className="align-self-start"> Frizeri</h3>
      </Card.Header>

      <Card.Body>
        <div>
          <div className="d-flex">
            <Button
              variant="info"
              onClick={() => setAddHairdresserToggle(!addHairdresserToggle)}
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
              {/* <Dropdown.Item onClick={() => handleSortClick("Najnovije")}>
                Najnoviji
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortClick("Najstarije")}>
                Najstariji
              </Dropdown.Item> */}
              <Dropdown.Item onClick={() => handleSortClick("S većom ocjenom")}>
                S većom ocjenom
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortClick("S manjom ocjenom")}
              >
                S manjom ocjenom
              </Dropdown.Item>
            </DropdownButton>
          </div>
          {addHairdresserToggle && (
            <AddHairdresser
              updateHairdressers={setIsUpdated}
              toggleAdd={() => setAddHairdresserToggle(!addHairdresserToggle)}
            />
          )}

          <hr />
        </div>
        {isLoading ? (
          <div className="text-center text-muted justify-content-center">
            <h6 className="pb-2">...Učitavanje frizera...</h6>
            <Spinner animation="border" variant="info" />
          </div>
        ) : fetchSuccess ? (
          hairdressers.length ? (
            hairdressers.map((hd) => {
              return (
                <Row className="my-2" key={hd._id}>
                  <Col xs={12}>
                    <Hairdresser
                      hairdresser={hd}
                      updateHairdressers={setIsUpdated}
                    />
                  </Col>
                </Row>
              );
            })
          ) : (
            <h6 className="text-muted text-center">
              Trenutno nema upisanih frizera.
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

export default Hairdressers;
