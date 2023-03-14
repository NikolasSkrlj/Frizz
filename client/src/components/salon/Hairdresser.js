import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import {
  Card,
  Spinner,
  Button,
  Alert,
  Row,
  Col,
  Form,
  ListGroup,
  Dropdown,
  DropdownButton,
  ToggleButton,
  Table,
  Modal,
  ButtonGroup,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .min(2, "Prekratko ime!")
    .max(25, "Predugo ime!")
    .required("Obavezno polje!"),
  wd: yup
    .array()
    .required("Obavezno polje!")
    .test(
      "test-name",
      "Početak i kraj radnog vremena mogu biti vrijednosti od 0-23",
      (value) => {
        for (const day of value) {
          if (day.startTime === undefined || day.endTime === undefined)
            return false;

          if (
            day.startTime < 0 ||
            day.startTime > 23 ||
            day.endTime < 0 ||
            day.endTime > 23
          ) {
            return false;
          }
        }
        return true;
        //console.log("u testu sam hehe" + value);
      }
    ),
  phone: yup
    .string()
    .min(9, "Unesite valjan tel. broj")
    .max(10, "Unesite valjan tel. broj")
    .required("Obavezno polje!"),
});

const Hairdresser = ({ hairdresser, updateHairdressers }) => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    //ako je uspjesno unesena recenzija, pri zatvaranju modala se rerenderaju recenzije i prikaze se najnovija unesena recenzija prva
    if (submitSuccess) {
      setMessage("");
      setMessageToggled(false);
      setSubmitSuccess(false);
      updateHairdressers((prevState) => !prevState);
    }
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleSubmit = async ({ name, phone, wd }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/hairsalon/update_hairdresser`,
        {
          name,
          phone,
          workDays: wd,
          hairdresserId: hairdresser._id,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      if (res.data.success) {
        setSubmitSuccess(true);
        setMessage(res.data.message);
        setMessageToggled(true);
        setIsEditable(false);
        setTimeout(() => {
          setMessageToggled(false);
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        setSubmitSuccess(false);
        setMessage(
          err.response.data.message ||
            "Došlo je do pogreške, pokušajte ponovno!"
        );
        setMessageToggled(true);
      }
    }
  };

  const handleDeleteClick = async (hairdresserId) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/hairsalon/delete_hairdresser`,

        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          data: {
            hairdresserId,
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
    <Card>
      <Card.Body>
        <Card.Title className="text-dark d-flex">
          <span className="py-0 ">
            <span className="align"> {hairdresser.name}</span>
            {hairdresser.globalRating ? (
              <span className="text-muted mx-2 py-0">
                <small className="mr-1">
                  <span className="align-bottom">
                    {hairdresser.globalRating}
                  </span>{" "}
                  <StarRatings
                    starDimension="17px"
                    rating={hairdresser.globalRating}
                    starRatedColor="orange"
                    numberOfStars={1}
                    name="Ocjena"
                  ></StarRatings>
                </small>
              </span>
            ) : (
              <small className="text-muted align-bottom mx-1">
                (nema ocjena)
              </small>
            )}
          </span>

          <ButtonGroup className="ml-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditable(true)}
            >
              <FaRegEdit />
            </Button>
            <Button variant="danger" size="sm" onClick={handleShow}>
              <FaTrash />
            </Button>
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton className="bg-info text-white">
                <Modal.Title>Izbriši frizera</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <Card>
                  <Card.Body>
                    <p className="m-4 text-center">
                      Jeste li sigurni da želite izbrisati frizera?
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
                            onClick={() => handleDeleteClick(hairdresser._id)}
                            block
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
          </ButtonGroup>
        </Card.Title>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => {
            //console.log(values);
            handleSubmit(values);
          }}
          validateOnChange={false}
          initialValues={{
            name: hairdresser.name,
            phone: hairdresser.phone,
            wd: hairdresser.workDays,
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            setErrors,
            setValues,
            initialValues,
          }) => (
            <Row>
              <fieldset disabled={!isEditable} className="w-100">
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="text-left w-100"
                >
                  <Col md={{ span: 12 }}>
                    <Form.Group as={Col} md="12" controlId="name">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Ime</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="text"
                            placeholder="Ime frizera"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12" controlId="phone">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Telefon</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="text"
                            placeholder="Tel. broj"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Radno vrijeme</b> <br />
                            <small className="text-muted">
                              Napomena: Neradni dan ima vrijednosti Od i Do
                              jednake 0.
                            </small>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Table striped bordered hover className="text-center">
                            <thead>
                              <tr>
                                <th>Dan</th>
                                <th>Od</th>
                                <th>Do</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>ponedjeljak</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[0].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[0].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[0].endTime"
                                    value={values.wd[0].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>utorak</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[1].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[1].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[1].endTime"
                                    value={values.wd[1].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>srijeda</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[2].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[2].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[2].endTime"
                                    value={values.wd[2].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>četvrtak</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[3].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[3].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[3].endTime"
                                    value={values.wd[3].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>petak</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[4].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[4].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[4].endTime"
                                    value={values.wd[4].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>subota</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[5].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[5].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[5].endTime"
                                    value={values.wd[5].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                              <tr>
                                <td>nedjelja</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[6].startTime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                    value={values.wd[6].startTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    name="wd[6].endTime"
                                    value={values.wd[6].endTime}
                                    onChange={handleChange}
                                    isInvalid={!!errors.wd}
                                  />

                                  <Form.Control.Feedback type="invalid">
                                    {errors.wd}
                                  </Form.Control.Feedback>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Alert
                      variant={submitSuccess ? "success" : "danger"}
                      show={messageToggled}
                    >
                      {message}
                    </Alert>
                    {isEditable && (
                      <Row>
                        <Col>
                          <Button
                            type="reset"
                            variant="danger"
                            className="mr-1 w-100"
                            onClick={() => {
                              setValues(initialValues);
                              setErrors({});
                              setIsEditable(false);
                            }}
                          >
                            Odustani
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            type="submit"
                            variant="success"
                            className="ml-1 w-100"
                          >
                            Spremi
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Form>
              </fieldset>
            </Row>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default Hairdresser;
