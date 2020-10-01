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
import Review from "./Review";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Reviews = () => {
  const { authToken } = useContext(GlobalContext);

  // const [salon, setSalon] = useState({});
  const limit = 10;

  const [reviews, setReviews] = useState([]);

  const [sortOption, setSortOption] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Sortiraj");

  const [totalReviewsCnt, setTotalReviewsCnt] = useState(0);
  const [page, setPage] = useState(0);
  const [filterButtonLabel, setFilterButtonLabel] = useState("Filtriraj");
  const [filter, setFilter] = useState("salonAndHairdressers");

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterClick = (term) => {
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
  };

  const handlePageChange = (direction) => {
    if (direction === "prev") {
      if (page <= 0) {
        return;
      }
      setPage(page - 1);
    } else {
      // 5 je limit po stranici zadan na backendu, sjeti se promijenit
      if ((page + 1) * limit >= totalReviewsCnt) {
        return;
      }
      setPage(page + 1);
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
      case "S većom ocjenom":
        setSortOption({ option: "rating", isAsc: false });
        break;
      case "S manjom ocjenom":
        setSortOption({ option: "rating", isAsc: true });
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
          `/hairsalon/get_reviews?page=${page}&filter=${filter}&sortBy=${
            sortOption.option
          }_${sortOption.isAsc ? "asc" : "desc"}`,
          {
            headers: {
              Authorization: "Bearer " + authToken,
            },
          }
        );
        setReviews(res.data.reviews);
        setTotalReviewsCnt(res.data.totalReviewsCnt);
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
  }, [sortOption, page, filter]);

  return (
    <Card style={{ minHeight: "100vh" }}>
      <Card.Header className="d-flex">
        <h3 className="align-self-start">Recenzije</h3>
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
                size="sm"
              >
                <Dropdown.Item
                  onClick={() => handleFilterClick("Salon i frizeri")}
                >
                  Recenzije za salon i frizere
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Salon")}>
                  Recenzije za salon
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterClick("Frizeri")}>
                  Recenzije za frizere
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                as={ButtonGroup}
                id="dropdown-basic-button"
                title={sortButtonLabel}
                variant="outline-secondary"
                size="sm"
              >
                <Dropdown.Item onClick={() => handleSortClick("Najnovije")}>
                  Najnovije
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortClick("Najstarije")}>
                  Najstarije
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortClick("S većom ocjenom")}
                >
                  S većom ocjenom
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleSortClick("S manjom ocjenom")}
                >
                  S manjom ocjenom
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>

          <hr />
        </div>
        {isLoading ? (
          <div className="text-center text-muted justify-content-center">
            <h6 className="pb-2">...Učitavanje recenzija...</h6>
            <Spinner animation="border" variant="info" />
          </div>
        ) : fetchSuccess ? (
          reviews.length ? (
            <>
              {reviews.map((review) => {
                return (
                  <Row className="my-2" key={review._id}>
                    <Col xs={12}>
                      <Card body>
                        <Review review={review} />
                      </Card>
                    </Col>
                  </Row>
                );
              })}
              {reviews.length ? (
                <div className="d-flex">
                  <ButtonGroup className="mx-auto">
                    <Button
                      variant="outline-secondary"
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
                      variant="secondary"
                      style={{ pointerEvents: "none" }}
                      size={window.innerWidth <= 765 ? "sm" : ""}
                    >
                      Stranica {page + 1} od{" "}
                      {Math.floor(
                        totalReviewsCnt / limit +
                          Math.ceil((totalReviewsCnt % limit) / limit)
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handlePageChange("next")}
                      disabled={(page + 1) * limit >= totalReviewsCnt}
                      size={window.innerWidth <= 765 ? "sm" : ""}
                    >
                      <FaAngleRight />
                    </Button>
                  </ButtonGroup>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <h6 className="text-muted text-center">Trenutno nema recenzija.</h6>
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

export default Reviews;
