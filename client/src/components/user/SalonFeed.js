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
          `/user/salons?filters=globalRating_${ratingFilter}|county_${countyFilter}&sortBy=${
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
  }, [page, sortOptions, ratingFilter, countyFilter]);

  useEffect(() => {
    setFetchSuccess(true);
  }, [salons]);

  return (
    <Card body>
      <Card className="mb-4">
        <Card.Header className=" d-flex">
          <Form className="mr-auto p-0">
            <Form.Row className="align-items-center">
              <Col sm={4} className="my-1">
                <Form.Label htmlFor="inlineFormInputName" srOnly>
                  Name
                </Form.Label>
                <Form.Control
                  id="inlineFormInputName"
                  placeholder="Traži salon, frizera, grad..."
                />
              </Col>
              <Col xs="auto" className="my-1">
                <Button type="submit">Submit</Button>
              </Col>
            </Form.Row>
          </Form>

          <Button
            variant="outline-info"
            className="ml-auto"
            onClick={handleFilterToggleClick}
          >
            Filter <FiSliders className="ml-2" />
          </Button>
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
                        }}
                      >
                        Sve
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("1");
                          setRatingFilterButtonLabel("1+");
                        }}
                      >
                        1+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("2");
                          setRatingFilterButtonLabel("2+");
                        }}
                      >
                        2+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("3");
                          setRatingFilterButtonLabel("3+");
                        }}
                      >
                        3+
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setRatingFilter("4");
                          setRatingFilterButtonLabel("4+");
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
                        }}
                      >
                        Sve
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ZAGREBAČKA");
                          setCountyFilterButtonLabel("ZAGREBAČKA");
                        }}
                      >
                        ZAGREBAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KRAPINSKO-ZAGORSKA");
                          setCountyFilterButtonLabel("KRAPINSKO-ZAGORSKA");
                        }}
                      >
                        KRAPINSKO-ZAGORSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("SISAČKO-MOSLAVAČKA");
                          setCountyFilterButtonLabel("SISAČKO-MOSLAVAČKA");
                        }}
                      >
                        SISAČKO-MOSLAVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KARLOVAČKA");
                          setCountyFilterButtonLabel("KARLOVAČKA");
                        }}
                      >
                        KARLOVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VARAŽDINSKA");
                          setCountyFilterButtonLabel("VARAŽDINSKA");
                        }}
                      >
                        VARAŽDINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("KOPRIVNIČKO-KRIŽEVAČKA");
                          setCountyFilterButtonLabel("KOPRIVNIČKO-KRIŽEVAČKA");
                        }}
                      >
                        KOPRIVNIČKO-KRIŽEVAČKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("BJELOVARSKO-BILOGORSKA");
                          setCountyFilterButtonLabel("BJELOVARSKO-BILOGORSKA");
                        }}
                      >
                        BJELOVARSKO-BILOGORSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("PRIMORSKO-GORANSKA");
                          setCountyFilterButtonLabel("PRIMORSKO-GORANSKA");
                        }}
                      >
                        PRIMORSKO-GORANSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("LIČKO-SENJSKA");
                          setCountyFilterButtonLabel("LIČKO-SENJSKA");
                        }}
                      >
                        LIČKO-SENJSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VIROVITIČKO-PODRAVSKA");
                          setCountyFilterButtonLabel("VIROVITIČKO-PODRAVSKA");
                        }}
                      >
                        VIROVITIČKO-PODRAVSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("POŽEŠKO-SLAVONSKA");
                          setCountyFilterButtonLabel("POŽEŠKO-SLAVONSKA");
                        }}
                      >
                        POŽEŠKO-SLAVONSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("BRODSKO-POSAVSKA");
                          setCountyFilterButtonLabel("BRODSKO-POSAVSKA");
                        }}
                      >
                        BRODSKO-POSAVSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ZADARSKA");
                          setCountyFilterButtonLabel("ZADARSKA");
                        }}
                      >
                        ZADARSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("OSJEČKO-BARANJSKA");
                          setCountyFilterButtonLabel("OSJEČKO-BARANJSKA");
                        }}
                      >
                        OSJEČKO-BARANJSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ŠIBENSKO-KNINSKA");
                          setCountyFilterButtonLabel("ŠIBENSKO-KNINSKA");
                        }}
                      >
                        ŠIBENSKO-KNINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("VUKOVARSKO-SRIJEMSKA");
                          setCountyFilterButtonLabel("VUKOVARSKO-SRIJEMSKA");
                        }}
                      >
                        VUKOVARSKO-SRIJEMSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("SPLITSKO-DALMATINSKA");
                          setCountyFilterButtonLabel("SPLITSKO-DALMATINSKA");
                        }}
                      >
                        SPLITSKO-DALMATINSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("ISTARSKA");
                          setCountyFilterButtonLabel("ISTARSKA");
                        }}
                      >
                        ISTARSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("DUBROVAČKO-NERETVANSKA");
                          setCountyFilterButtonLabel("DUBROVAČKO-NERETVANSKA");
                        }}
                      >
                        DUBROVAČKO-NERETVANSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("MEĐIMURSKA");
                          setCountyFilterButtonLabel("MEĐIMURSKA");
                        }}
                      >
                        MEĐIMURSKA
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCountyFilter("GRAD ZAGREB");
                          setCountyFilterButtonLabel("GRAD ZAGREB");
                        }}
                      >
                        GRAD ZAGREB
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
          <h6 className="text-muted text-center">Trenutno nema salona.</h6>
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
