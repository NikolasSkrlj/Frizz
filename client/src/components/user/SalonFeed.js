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
  Form,
} from "react-bootstrap";
import Salon from "./Salon";
import { FiSliders } from "react-icons/fi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "../../styles/Misc.css";

const SalonFeed = () => {
  const { authToken } = useContext(GlobalContext);
  const [filtersToggle, setFiltersToggle] = useState(false);
  const [salons, setSalons] = useState([]);

  //filtriranje i sortiranje
  const [sortOptions, setSortOptions] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Odaberi");
  const [totalSalonsCnt, setTotalSalonsCnt] = useState(0);
  const [page, setPage] = useState(0);

  const [ratingFilterButtonLabel, setRatingFilterButtonLabel] = useState(
    "Odaberi"
  );
  const [ratingFilter, setRatingFilter] = useState("0");

  const [countyFilterButtonLabel, setCountyFilterButtonLabel] = useState(
    "Odaberi"
  );
  const [countyFilter, setCountyFilter] = useState("any");

  const [searchTerm, setSearchTerm] = useState("");
  //limit 5 salona po stranici
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = e.target.term.value;

    setSearchTerm(term);
  };

  const handleFilterToggleClick = () => {
    setFiltersToggle(!filtersToggle);
  };

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get(
          `/user/get_salons?q=${searchTerm}&filters=globalRating_${ratingFilter}|county_${countyFilter}&sortBy=${
            sortOptions.option
          }_${sortOptions.isAsc ? "asc" : "desc"}&page=${page}`,
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
  }, [page, sortOptions, ratingFilter, countyFilter, searchTerm]);

  useEffect(() => {
    setFetchSuccess(true);
  }, [salons]);

  return (
    <Card body style={{ minHeight: "100vh" }}>
      <Card className="mb-4">
        <Card.Header>
          <Row className="d-flex mb-xs-2">
            <Col xs={12} sm={9} className="mr-auto">
              <Form onSubmit={handleSearchSubmit}>
                <Form.Row className="align-items-center">
                  <Col sm={6} className="my-1">
                    <Form.Control
                      id="inlineFormInputName"
                      name="term"
                      placeholder="Ime salona, frizera, grada.."
                    />
                  </Col>
                  <Col xs={12} sm="auto" className="my-1">
                    <Button block type="submit" variant="info">
                      Traži
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </Col>

            <Button
              variant="outline-info"
              className="ml-auto"
              onClick={handleFilterToggleClick}
            >
              Filter <FiSliders className="ml-2" />
            </Button>
          </Row>
        </Card.Header>

        {filtersToggle ? (
          <Card.Body>
            <Row>
              <Col>
                <div>
                  <span className="mb-2">
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
              <Col className="filters">
                <b> Filtriraj </b>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="mr-2">Po ocjeni </span>
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={
                        ratingFilter === "0"
                          ? "Odaberi"
                          : ratingFilterButtonLabel
                      }
                      variant="outline-secondary"
                      size="sm"
                      className="d-inline-block"
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("0");
                          setRatingFilterButtonLabel("Sve");
                          setPage(0);
                        }}
                      >
                        Sve
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("1");
                          setRatingFilterButtonLabel("1+");
                          setPage(0);
                        }}
                      >
                        1+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("2");
                          setRatingFilterButtonLabel("2+");
                          setPage(0);
                        }}
                      >
                        2+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("3");
                          setRatingFilterButtonLabel("3+");
                          setPage(0);
                        }}
                      >
                        3+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("4");
                          setRatingFilterButtonLabel("4+");
                          setPage(0);
                        }}
                      >
                        4+
                      </Dropdown.Item>
                    </DropdownButton>
                  </ListGroup.Item>
                  {/* Dropdown sa listom zupanija */}
                  <ListGroup.Item>
                    <span className="mr-2">Po županiji </span>

                    <DropdownButton
                      id="dropdown-basic-button"
                      title={
                        countyFilter === "any"
                          ? "Odaberi"
                          : countyFilterButtonLabel
                      }
                      variant="outline-secondary"
                      size="sm"
                      className="d-inline-block"
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("any");
                          setCountyFilterButtonLabel("Sve");
                          setPage(0);
                        }}
                      >
                        Sve
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ZAGREBAČKA");
                          setCountyFilterButtonLabel("ZAGREBAČKA");
                          setPage(0);
                        }}
                      >
                        ZAGREBAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KRAPINSKO-ZAGORSKA");
                          setCountyFilterButtonLabel("KRAPINSKO-ZAGORSKA");
                          setPage(0);
                        }}
                      >
                        KRAPINSKO-ZAGORSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("SISAČKO-MOSLAVAČKA");
                          setCountyFilterButtonLabel("SISAČKO-MOSLAVAČKA");
                          setPage(0);
                        }}
                      >
                        SISAČKO-MOSLAVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KARLOVAČKA");
                          setCountyFilterButtonLabel("KARLOVAČKA");
                          setPage(0);
                        }}
                      >
                        KARLOVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VARAŽDINSKA");
                          setCountyFilterButtonLabel("VARAŽDINSKA");
                          setPage(0);
                        }}
                      >
                        VARAŽDINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KOPRIVNIČKO-KRIŽEVAČKA");
                          setCountyFilterButtonLabel("KOPRIVNIČKO-KRIŽEVAČKA");
                          setPage(0);
                        }}
                      >
                        KOPRIVNIČKO-KRIŽEVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("BJELOVARSKO-BILOGORSKA");
                          setCountyFilterButtonLabel("BJELOVARSKO-BILOGORSKA");
                          setPage(0);
                        }}
                      >
                        BJELOVARSKO-BILOGORSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("PRIMORSKO-GORANSKA");
                          setCountyFilterButtonLabel("PRIMORSKO-GORANSKA");
                          setPage(0);
                        }}
                      >
                        PRIMORSKO-GORANSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("LIČKO-SENJSKA");
                          setCountyFilterButtonLabel("LIČKO-SENJSKA");
                          setPage(0);
                        }}
                      >
                        LIČKO-SENJSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VIROVITIČKO-PODRAVSKA");
                          setCountyFilterButtonLabel("VIROVITIČKO-PODRAVSKA");
                          setPage(0);
                        }}
                      >
                        VIROVITIČKO-PODRAVSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("POŽEŠKO-SLAVONSKA");
                          setCountyFilterButtonLabel("POŽEŠKO-SLAVONSKA");
                          setPage(0);
                        }}
                      >
                        POŽEŠKO-SLAVONSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("BRODSKO-POSAVSKA");
                          setCountyFilterButtonLabel("BRODSKO-POSAVSKA");
                          setPage(0);
                        }}
                      >
                        BRODSKO-POSAVSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ZADARSKA");
                          setCountyFilterButtonLabel("ZADARSKA");
                          setPage(0);
                        }}
                      >
                        ZADARSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("OSJEČKO-BARANJSKA");
                          setCountyFilterButtonLabel("OSJEČKO-BARANJSKA");
                          setPage(0);
                        }}
                      >
                        OSJEČKO-BARANJSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ŠIBENSKO-KNINSKA");
                          setCountyFilterButtonLabel("ŠIBENSKO-KNINSKA");
                          setPage(0);
                        }}
                      >
                        ŠIBENSKO-KNINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VUKOVARSKO-SRIJEMSKA");
                          setCountyFilterButtonLabel("VUKOVARSKO-SRIJEMSKA");
                          setPage(0);
                        }}
                      >
                        VUKOVARSKO-SRIJEMSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("SPLITSKO-DALMATINSKA");
                          setCountyFilterButtonLabel("SPLITSKO-DALMATINSKA");
                          setPage(0);
                        }}
                      >
                        SPLITSKO-DALMATINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ISTARSKA");
                          setCountyFilterButtonLabel("ISTARSKA");
                          setPage(0);
                        }}
                      >
                        ISTARSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("DUBROVAČKO-NERETVANSKA");
                          setCountyFilterButtonLabel("DUBROVAČKO-NERETVANSKA");
                          setPage(0);
                        }}
                      >
                        DUBROVAČKO-NERETVANSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("MEĐIMURSKA");
                          setCountyFilterButtonLabel("MEĐIMURSKA");
                          setPage(0);
                        }}
                      >
                        MEĐIMURSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("GRAD ZAGREB");
                          setCountyFilterButtonLabel("GRAD ZAGREB");
                          setPage(0);
                        }}
                      >
                        GRAD ZAGREB
                      </Dropdown.Item>
                    </DropdownButton>
                  </ListGroup.Item>
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
          <h6 className="text-muted text-center">
            {searchTerm ? "Nema rezultata." : "Trenutno nema salona."}
          </h6>
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
