import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import {
  Spinner,
  Button,
  Alert,
  Media,
  DropdownButton,
  Container,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Formik } from "formik";
import * as yup from "yup";
import hr from "date-fns/locale/hr";
import SubmitReviewForm from "./SubmitReviewForm";

const SalonReviews = ({ salon, setSalon }) => {
  const { authToken, user, setUser } = useContext(GlobalContext);

  //default ce biti po datumu prema najnovijim
  const [sortOptions, setSortOptions] = useState({
    option: "updatedAt",
    isAsc: false,
  });
  const [sortButtonLabel, setSortButtonLabel] = useState("Sortiraj po");
  const [totalReviewsCnt, setTotalReviewsCnt] = useState(0);
  const [page, setPage] = useState(0);

  const [filterButtonLabel, setFilterButtonLabel] = useState("Filtriraj");
  const [filter, setFilter] = useState("salonAndHairdressers");

  /*
    limit na backendu po stranici je default 5(sada 3) i moze se stavit tu varijablu limit pa bi korisnik mogao odredjivati broj po
    stranici al to sad nije bitno
  */

  const limit = 3;
  const [reviews, setReviews] = useState([]);

  //ovo sluzi za rerender useru kad objavi recenziju
  const [isUpdated, setIsUpdated] = useState(false);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  const params = useParams();

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
  };
  const handleSortClick = (term) => {
    setSortButtonLabel(term);
    switch (term) {
      case "Najnovije":
        setSortOptions({ option: "updatedAt", isAsc: false });
        break;
      case "Najstarije":
        setSortOptions({ option: "updatedAt", isAsc: true });
        break;
      case "S većom ocjenom":
        setSortOptions({ option: "rating", isAsc: false });
        break;
      case "S nižom ocjenom":
        setSortOptions({ option: "rating", isAsc: true });
        break;
      default:
        return;
    }
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

  useEffect(() => {
    setFetchSuccess(false);
    setIsLoading(true);
    try {
      const getData = async () => {
        const res = await axios.get(
          `/user/${salon._id}/reviews?filter=${filter}&sortBy=${
            sortOptions.option
          }_${sortOptions.isAsc ? "asc" : "desc"}&page=${page}`,
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
  }, [sortOptions, page, isUpdated, filter]);

  return (
    <>
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
              className="ml-auto"
              size="sm"
            >
              <Dropdown.Item onClick={() => handleSortClick("Najnovije")}>
                Najnoviji
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortClick("Najstarije")}>
                Najstariji
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortClick("S većom ocjenom")}>
                S većom ocjenom
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortClick("S nižom ocjenom")}>
                S nižom ocjenom
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
        <div>
          <SubmitReviewForm
            salon={salon}
            updateReviews={setIsUpdated}
            setPage={setPage}
            setSalon={setSalon}
          />
          {reviews ? (
            reviews.map((review) => {
              return (
                <Media key={review._id} className="my-2">
                  <img
                    width={50}
                    height={50}
                    className="mr-3 rounded-circle"
                    src={
                      review.userId.profilePic
                        ? `/user/${review.userId._id}/profile_pic`
                        : review.userId.gender === "M"
                        ? "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
                        : "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
                    }
                    alt="Generic placeholder"
                  />
                  <Media.Body>
                    <h5 className="d-inline-block">{review.userId.name}</h5>
                    <span className="text-muted mx-1">
                      <small>
                        {formatDistanceToNow(new Date(review.updatedAt), {
                          addSuffix: true,
                          locale: hr,
                        })}
                      </small>
                    </span>
                    <div className="align-middle">
                      <h6>
                        <StarRatings
                          starDimension="18px"
                          starSpacing="3px"
                          rating={review.rating}
                          starRatedColor="yellow"
                          numberOfStars={5}
                          name="Ocjena"
                          className="d-inline-block align-middle"
                        />
                      </h6>
                    </div>
                    <p>
                      <span className="text-muted">
                        {review.hairdresserId
                          ? `[frizer - ${review.hairdresserId.name}] `
                          : "[salon] "}
                      </span>
                      {review.comment || ""}
                    </p>
                  </Media.Body>
                </Media>
              );
            })
          ) : (
            <h6 className="text-muted">Nema recenzija.</h6>
          )}
          {/* Prikaz navigacije za stranice */}
          <div className="d-flex">
            <ButtonGroup className="mx-auto">
              <Button
                variant="outline-info"
                onClick={() => handlePageChange("prev")}
                disabled={page === 0}
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
                  totalReviewsCnt / limit +
                    Math.ceil((totalReviewsCnt % limit) / limit)
                )}
              </Button>
              <Button
                variant="outline-info"
                onClick={() => handlePageChange("next")}
                disabled={(page + 1) * limit >= totalReviewsCnt}
                size={window.innerWidth <= 765 ? "sm" : ""}
              >
                <FaAngleRight />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <Alert variant="danger">{message}</Alert>
      )}
    </>
  );
};

export default SalonReviews;
