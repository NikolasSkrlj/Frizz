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
  Dropdown,
  DropdownButton,
  ButtonGroup,
  ListGroup,
} from "react-bootstrap";
import Salon from "./Salon";
import { FiSliders } from "react-icons/fi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const SalonFeed = () => {
  const { authToken } = useContext(GlobalContext);
  const [filtersToggle, setFiltersToggle] = useState(false); // ovo ce biti za filtriranje podataka dal se vidi card
  //const [filters, setFilters] = useState({}); // ovdje ce se nalaziti filteri(objekt sa match, sort, project i tim propertyma)
  const [salons, setSalons] = useState([]);

  //filtriranje i sortiranje
  const [sortOptions, setSortOptions] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Odaberi");
  const [totalSalonsCnt, setTotalSalonsCnt] = useState(0);
  const [page, setPage] = useState(0);

  const [filterButtonLabel, setFilterButtonLabel] = useState("Odaberi");
  const [filter, setFilter] = useState("");

  const limit = 5;

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      case "Najnoviji":
        setSortOptions({ option: "updatedAt", isAsc: false });
        break;
      case "Najstariji":
        setSortOptions({ option: "updatedAt", isAsc: true });
        break;
      case "S većom ocjenom":
        setSortOptions({ option: "globalRating", isAsc: false });
        break;
      case "S manjom ocjenom":
        setSortOptions({ option: "globalRating", isAsc: true });
        break;
      default:
        return;
    }
    setPage(0);
  };

  const handlePageChange = (direction) => {
    if (direction === "prev") {
      if (page <= 0) {
        return;
      }
      setPage(page - 1);
    } else {
      // 5 je limit po stranici zadan na backendu, sjeti se promijenit
      if ((page + 1) * limit >= totalSalonsCnt) {
        return;
      }
      setPage(page + 1);
    }
  };

  /*  const handleFilterClick = (term) => {
    setFilterButtonLabel(term);
    switch (term) {
      case "Salon i frizeri":
        setFilter("salonAndHairdressers");
        break;
      case "Salon":
        setFilter("salon");
        break;
      case "Frizeri":
        setFilter("hairdressers");
        break;
      default:
        return;
    }
    setPage(0);
  }; */

  const handleFilterToggleClick = () => {
    setFiltersToggle(!filtersToggle);
  };

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get(
          `/user/salons?filter=${filter}&sortBy=${sortOptions.option}_${
            sortOptions.isAsc ? "asc" : "desc"
          }&page=${page}`,
          {
            // ovo mozemo jer smo stavili proxy u package.json
            headers: {
              Authorization: authToken,
            },
          }
        );

        setSalons(res.data.salons);
        setTotalSalonsCnt(res.data.totalSalonsCnt);
        setIsLoading(false);
      } catch (err) {
        if (err.response) {
          setFetchSuccess(false);
          setIsLoading(false);
        }
      }
    };
    getData();
  }, [page, sortOptions, filter]);

  useEffect(() => {
    setFetchSuccess(true);
  }, [salons]);

  return (
    <Card body>
      <Card className="mb-4">
        <Card.Header className=" d-flex justify-content-end">
          <Button variant="outline-info" onClick={handleFilterToggleClick}>
            Filter <FiSliders className="ml-2" />
          </Button>
        </Card.Header>

        {filtersToggle ? (
          <Card.Body>
            <Row>
              <Col>
                <div>
                  <span>
                    <b>Sortiraj po </b>
                  </span>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={sortButtonLabel}
                    variant="outline-secondary"
                    size="sm"
                    className="d-inline-block"
                  >
                    <Dropdown.Item onClick={() => handleSortClick("Najnoviji")}>
                      Najnoviji
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSortClick("Najstariji")}
                    >
                      Najstariji
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSortClick("S većom ocjenom")}
                    >
                      S većom ocjenom
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleSortClick("S manjom ocjenom")}
                    >
                      S nižom ocjenom
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </Col>
              <Col>
                <b> Filtriraj </b>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span>Prema ocjeni </span>
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={"Odaberi"}
                      variant="outline-secondary"
                      size="sm"
                      className="d-inline-block"
                    >
                      <Dropdown.Item onClick={() => console.log("1+")}>
                        1+
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log("2+")}>
                        2+
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log("3+")}>
                        3+
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log("4+")}>
                        4+
                      </Dropdown.Item>
                    </DropdownButton>
                  </ListGroup.Item>
                  {/* <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item> */}
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        ) : (
          <div />
        )}
      </Card>
      {isLoading ? (
        <div className="text-center text-muted justify-content-center">
          <h6 className="pb-2">...Učitavanje salona...</h6>
          <Spinner animation="border" variant="info" />
        </div>
      ) : fetchSuccess ? (
        salons.length ? (
          <div>
            {salons.map((salon) => {
              return <Salon salonData={salon} key={salon.id} />;
            })}

            {salons.length ? (
              <div className="d-flex">
                <ButtonGroup className="mx-auto">
                  <Button
                    variant="outline-info"
                    onClick={() => handlePageChange("prev")}
                    disabled={page <= 0}
                    size={window.innerWidth <= 765 ? "sm" : ""}
                  >
                    <FaAngleLeft />
                  </Button>

                  {/* 
                  Znaci dijeli se broj ukupnih recenzija na broj njih po stranici i to je broj cijelih stranica a ako ostane ostatak mora biti jos
                  jedna, to rjesava math.ceil ostatka jer ako nema ostatka ceil ce dati nula i nema dodatne stranice
                */}
                  <Button
                    variant="info"
                    style={{ pointerEvents: "none" }}
                    size={window.innerWidth <= 765 ? "sm" : ""}
                  >
                    Stranica {page + 1} od{" "}
                    {Math.floor(
                      totalSalonsCnt / limit +
                        Math.ceil((totalSalonsCnt % limit) / limit)
                    )}
                  </Button>
                  <Button
                    variant="outline-info"
                    onClick={() => handlePageChange("next")}
                    disabled={(page + 1) * limit >= totalSalonsCnt}
                    size={window.innerWidth <= 765 ? "sm" : ""}
                  >
                    <FaAngleRight />
                  </Button>
                </ButtonGroup>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <h6 className="text-muted">Nema salona</h6>
        )
      ) : (
        <Alert variant="danger">
          <Alert.Heading>Došlo je do pogreške!</Alert.Heading>
          <p>Molimo osvježite stranicu!</p>
        </Alert>
      )}
    </Card>
  );
};

export default SalonFeed;
