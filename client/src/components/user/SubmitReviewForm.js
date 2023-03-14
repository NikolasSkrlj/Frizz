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
  Tab,
  Nav,
  Card,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import HairdresserReviewSubmit from "./HairdresserReviewSubmit";

const SubmitReviewForm = ({ salon, updateReviews, setPage, updateSalon }) => {
  const { authToken, user, setUser } = useContext(GlobalContext);
  const [show, setShow] = useState(false);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [review, setReview] = useState({ rating: 0, comment: "" });

  const handleClose = () => {
    setShow(false);
    setReview({ comment: "", rating: 0 });

    //ako je uspjesno unesena recenzija, pri zatvaranju modala se rerenderaju recenzije i prikaze se najnovija unesena recenzija prva
    if (submitSuccess) {
      updateReviews((prevState) => !prevState);
      setPage(0);
      updateSalon((prevState) => !prevState);
    }
  };
  const handleShow = () => setShow(true);

  const handleClick = async () => {
    //ovo ne treba jer je button disabled al cisto nek je tu
    if (review.rating === 0) {
      setSubmitSuccess(false);
      setMessage("Odaberite ocjenu!");
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
        /* setSalon((prevState) => {
          return {
            ...prevState,
            reviews: res.data.reviews,
            // globalRating: res.data.newRating, updatanje ratinga ne radi jer se vrsi asinkrono tkda se prije posalji response nego se azurira
          };
        }); */
        //console.log(res.data.reviews);
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
    <div>
      {" "}
      <Row className="mt-2 mb-4">
        <Col
          sm={6}
          className="d-flex justify-content-center justify-content-sm-end pr-sm-0"
        >
          <Button
            variant="link"
            className="text-dark text-muted text-italic"
            style={{ pointerEvents: "none" }}
          >
            Reci i ti što misliš
          </Button>
          {/* <div className="text-muted ">Neka se i tvoj glas čuje </div> */}
        </Col>
        <Col
          sm={6}
          className="d-flex justify-content-center justify-content-sm-start pl-sm-0"
        >
          <Button
            variant="link"
            className="text-info text-bold align-top "
            onClick={handleShow}
          >
            Ostavi recenziju
          </Button>
        </Col>
      </Row>
      {/*  <div className="d-flex justify-content-center  align-bottom ">
        <div className="text-muted text-small">
          Neka se i tvoj glas čuje{" "}
          
        </div>{" "}
      </div> */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Ostavi recenziju</Modal.Title>
        </Modal.Header>
        <Modal.Body as={Card} className="p-0">
          <Tab.Container id="left-tabs-example" defaultActiveKey="salon">
            <Card.Header>
              <Nav variant="tabs" fill>
                <Nav.Item>
                  <Nav.Link className="text-info " eventKey="salon">
                    Za salon
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="text-info" eventKey="hairdressers">
                    Za frizera
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Tab.Content>
              <Tab.Pane eventKey="salon">
                <Card.Body>
                  <div className="my-2">
                    <div className="d-flex justify-content-center mb-3">
                      <StarRatings
                        starDimension="30px"
                        starSpacing="3px"
                        rating={review.rating}
                        changeRating={(rating) =>
                          setReview({ ...review, rating })
                        }
                        numberOfStars={5}
                        name="Ocjena"
                        starRatedColor="orange"
                        starHoverColor="orange"
                      />
                    </div>
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
                        <Form.Text className="text-muted">
                          (opcionalno)
                        </Form.Text>
                      </Form.Group>
                    </Form>
                    <Alert
                      variant={submitSuccess ? "success" : "danger"}
                      show={messageToggled}
                    >
                      {message}
                    </Alert>
                    {submitSuccess && message ? (
                      <Button variant="secondary" onClick={handleClose} block>
                        Zatvori
                      </Button>
                    ) : (
                      <Button
                        variant="info"
                        onClick={handleClick}
                        block
                        disabled={review.rating === 0}
                      >
                        Pošalji
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Tab.Pane>
              <Tab.Pane eventKey="hairdressers">
                <Card.Body>
                  <HairdresserReviewSubmit
                    hairdressers={salon.hairdressers}
                    handleClose={handleClose}
                    updateReviews={updateReviews}
                    salon={salon}
                    updateSalon={updateSalon}
                  />
                </Card.Body>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubmitReviewForm;
