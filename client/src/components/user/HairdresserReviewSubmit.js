import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import {
  Spinner,
  Button,
  Alert,
  Row,
  Col,
  Modal,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";

const HairdresserReviewSubmit = ({
  hairdressers,
  handleClose,
  salon,
  updateReviews,
  updateSalon,
}) => {
  const { authToken, user, setUser } = useContext(GlobalContext);
  const [show, setShow] = useState(false);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // frizer kojeg ce odabrat
  const [hairdresserId, setHairdresserId] = useState("");
  const [hairdresserDropdownLabel, setHairdresserDropdownLabel] =
    useState("Odaberi frizera");

  const [review, setReview] = useState({ rating: 0, comment: "" });

  const handleClick = async () => {
    if (!hairdresserId || review.rating === 0) {
      setSubmitSuccess(false);
      setMessage("Odaberite frizera i ocjenu!");
      setMessageToggled(true);
      return;
    }
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/${salon._id}/submit_review`,
        {
          rating: review.rating,
          comment: review.comment,
          hairdresserId,
        },
        {
          headers: {
            Authorization: "Bearer " + authToken,
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
    <>
      <div className="my-2">
        <Row className="mb-3">
          <Col xs={12} sm={6} className="d-flex justify-content-center">
            <DropdownButton
              id="dropdown-basic-button"
              title={hairdresserDropdownLabel}
              variant="outline-secondary"
              className="mb-2"
              block
              disabled={hairdressers.length <= 0}
            >
              {hairdressers.map((hd) => {
                return (
                  <Dropdown.Item
                    key={hd._id}
                    onClick={() => {
                      setHairdresserId(hd._id);
                      setHairdresserDropdownLabel(hd.name);
                    }}
                  >
                    {hd.name}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </Col>
          <Col xs={12} sm={6} className="d-flex justify-content-center">
            <StarRatings
              starDimension="30px"
              starSpacing="3px"
              rating={review.rating}
              changeRating={(rating) => setReview({ ...review, rating })}
              numberOfStars={5}
              name="Ocjena"
              starRatedColor="orange"
              starHoverColor="orange"
            />
          </Col>
        </Row>
        {hairdressers.length <= 0 ? (
          <div className="text-muted text-center m-2">
            Trenutno nema upisanih frizera
          </div>
        ) : (
          <></>
        )}
        <Form className="d-block">
          <Form.Group controlId="komentar">
            <Form.Control
              as="textarea"
              rows="2"
              onChange={(e) =>
                setReview({
                  ...review,
                  comment: e.target.value.trim(),
                })
              }
            />
            <Form.Text className="text-muted">(opcionalno)</Form.Text>
          </Form.Group>
        </Form>
        <Alert
          variant={submitSuccess ? "success" : "danger"}
          show={messageToggled}
        >
          {message}
        </Alert>
        {submitSuccess && message ? (
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              updateReviews();
              updateSalon((prevState) => !prevState);
            }}
            block
          >
            Zatvori
          </Button>
        ) : (
          <Button
            variant="info"
            onClick={handleClick}
            block
            disabled={hairdresserId === "" || review.rating === 0}
          >
            Pošalji
          </Button>
        )}
      </div>
    </>
  );
};

export default HairdresserReviewSubmit;
