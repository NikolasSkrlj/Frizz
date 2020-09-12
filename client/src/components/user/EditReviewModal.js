import React, { useState, useContext, useEffect } from "react";

import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import {
  Spinner,
  Button,
  Alert,
  Row,
  Col,
  Modal,
  ButtonGroup,
  Form,
  Tab,
  Nav,
  Dropdown,
  DropdownButton,
  Card,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { FaTrash, FaRegEdit } from "react-icons/fa";

const EditReviewModal = ({ salon, updateReviews, setPage, review }) => {
  const { authToken, user, setUser } = useContext(GlobalContext);
  const [show, setShow] = useState(false);

  const [userAction, setUserAction] = useState("edit");

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [editedReview, setEditedReview] = useState({
    rating: 0,
    comment: "",
  });

  // Ako je review za frizera
  // frizer kojeg ce odabrat
  const [editedHairdresserId, setEditedHairdresserId] = useState("");
  const [
    editedHairdresserDropdownLabel,
    setEditedHairdresserDropdownLabel,
  ] = useState("Odaberi frizera");

  //pri prvom renderu postavljamo vrijednost recenzije
  useEffect(() => {
    setEditedReview({
      rating: review.rating,
      comment: review.comment,
    });
    if (review.hairdresserId) {
      setEditedHairdresserId(review.hairdresserId._id);
      setEditedHairdresserDropdownLabel(review.hairdresserId.name);
    }
  }, []);

  const handleClose = () => {
    setShow(false);

    //ako je uspjesno unesena recenzija, pri zatvaranju modala se rerenderaju recenzije i prikaze se najnovija unesena recenzija prva
    if (submitSuccess) {
      updateReviews((prevState) => !prevState);
      setPage(0);
    }
  };
  const handleShow = (action) => {
    if (action === "edit") {
      setUserAction("edit");
    } else {
      setUserAction("delete");
    }
    setShow(true);
  };

  const handleEditClick = async (reviewId) => {
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
      const res = await axios.put(
        `/user/edit_review`,
        {
          rating: editedReview.rating,
          comment: editedReview.comment,
          hairdresserId: editedHairdresserId,
          reviewId,
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
  const handleDeleteClick = async (reviewId) => {
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
      const res = await axios.delete(
        `/user/delete_review`,

        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          data: {
            reviewId,
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
    <div>
      <ButtonGroup className="ml-auto">
        <Button variant="danger" size="sm" onClick={() => handleShow("delete")}>
          <FaTrash />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleShow("edit")}
        >
          <FaRegEdit />
        </Button>
      </ButtonGroup>

      {userAction === "edit" ? (
        <div>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-info text-white">
              <Modal.Title>Uredi recenziju</Modal.Title>
            </Modal.Header>
            <Modal.Body as={Card} className="p-0">
              {review.hairdresserId ? (
                <Tab.Container id="left-tabs-example" defaultActiveKey="frizer">
                  <Card.Header>
                    <Nav variant="tabs" fill>
                      <Nav.Item>
                        <Nav.Link className="text-info " eventKey="frizer">
                          Za frizera
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>

                  <Tab.Content>
                    <Tab.Pane eventKey="frizer">
                      <Card.Body>
                        <div className="my-2">
                          <Row className="mb-3">
                            <Col
                              xs={12}
                              sm={6}
                              className="d-flex justify-content-center"
                            >
                              <DropdownButton
                                id="dropdown-basic-button"
                                title={editedHairdresserDropdownLabel}
                                variant="outline-secondary"
                                className="mb-2"
                                block
                              >
                                {salon.hairdressers.map((hd) => {
                                  return (
                                    <Dropdown.Item
                                      key={hd._id}
                                      onClick={() => {
                                        setEditedHairdresserId(hd._id);
                                        setEditedHairdresserDropdownLabel(
                                          hd.name
                                        );
                                      }}
                                    >
                                      {hd.name}
                                    </Dropdown.Item>
                                  );
                                })}
                              </DropdownButton>
                            </Col>
                            <Col
                              xs={12}
                              sm={6}
                              className="d-flex justify-content-center"
                            >
                              <StarRatings
                                starDimension="30px"
                                starSpacing="3px"
                                rating={editedReview.rating}
                                changeRating={(rating) =>
                                  setEditedReview({ ...editedReview, rating })
                                }
                                numberOfStars={5}
                                name="Ocjena"
                                starRatedColor="yellow"
                                starHoverColor="yellow"
                              />
                            </Col>
                          </Row>

                          <Form className="d-block">
                            <Form.Group controlId="komentar">
                              <Form.Control
                                as="textarea"
                                rows="2"
                                value={editedReview.comment}
                                onChange={(e) => {
                                  setEditedReview({
                                    ...editedReview,
                                    comment: e.target.value,
                                  });
                                }}
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
                            <Button
                              variant="secondary"
                              onClick={() => {
                                handleClose();
                                updateReviews();
                              }}
                              block
                            >
                              Odustani
                            </Button>
                          ) : (
                            <Button
                              variant="info"
                              onClick={() => handleEditClick(review._id)}
                              block
                            >
                              Spremi
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              ) : (
                <Tab.Container id="left-tabs-example" defaultActiveKey="salon">
                  <Card.Header>
                    <Nav variant="tabs" fill>
                      <Nav.Item>
                        <Nav.Link className="text-info " eventKey="salon">
                          Za salon
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
                              rating={editedReview.rating}
                              changeRating={(rating) =>
                                setEditedReview({ ...editedReview, rating })
                              }
                              numberOfStars={5}
                              name="Ocjena"
                              starRatedColor="yellow"
                              starHoverColor="yellow"
                            />
                          </div>
                          <Form className="d-block">
                            <Form.Group controlId="komentar">
                              <Form.Control
                                as="textarea"
                                rows="2"
                                value={editedReview.comment}
                                onChange={(e) =>
                                  setEditedReview({
                                    ...editedReview,
                                    comment: e.target.value,
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
                            <Button
                              variant="secondary"
                              onClick={handleClose}
                              block
                            >
                              Zatvori
                            </Button>
                          ) : (
                            <Button
                              variant="info"
                              onClick={() => handleEditClick(review._id)}
                              block
                              disabled={review.rating === 0}
                            >
                              Spremi
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              )}
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title>Izbriši recenziju</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Card>
              <Card.Body>
                <p className="m-4 text-center">
                  Želite li izbrisati recenziju?
                </p>
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
                  <Row>
                    <Col>
                      <Button
                        variant="danger"
                        onClick={handleClose}
                        block
                        className="mr-1"
                      >
                        Odustani
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        className="ml-1"
                        variant="success"
                        onClick={() => handleDeleteClick(review._id)}
                        block
                        disabled={review.rating === 0}
                      >
                        Potvrdi
                      </Button>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default EditReviewModal;
