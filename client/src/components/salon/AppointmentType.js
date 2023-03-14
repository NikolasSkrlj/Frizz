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
  price: yup
    .number()
    .min(1, "Cijena mora biti veća od 0")
    .required("Obavezno polje!"),
  duration: yup
    .number()
    .min(15, "Trajanje mora biti minimalno 15 min")
    .required("Obavezno polje!"),
});

const AppointmentType = ({ appointmentType, updateAppTypes }) => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);

    if (submitSuccess) {
      setMessage("");
      setMessageToggled(false);
      setSubmitSuccess(false);
      updateAppTypes((prevState) => !prevState);
    }
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleSubmit = async ({
    name,
    price,
    intendedGender,
    duration,
    description,
  }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/hairsalon/update_appointmentType`,
        {
          name,
          intendedGender,
          duration,
          price,
          description,
          appointmentTypeId: appointmentType._id,
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

  const handleDeleteClick = async (appointmentTypeId) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/hairsalon/delete_appointmentType`,

        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          data: {
            appointmentTypeId,
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
          <span className="py-0 align-bottom">{appointmentType.name}</span>

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
                <Modal.Title>Izbriši vrstu termina</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <Card>
                  <Card.Body>
                    <p className="m-4 text-center">
                      Jeste li sigurni da želite izbrisati vrstu termina?
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
                            onClick={() =>
                              handleDeleteClick(appointmentType._id)
                            }
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
            name: appointmentType.name,
            price: appointmentType.price,
            duration: appointmentType.duration,
            intendedGender: appointmentType.intendedGender,
            description: appointmentType.description,
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
                            <b>Naziv termina</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="text"
                            placeholder="Naziv termina"
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
                            <b>Opis </b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="text"
                            placeholder="Opis"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.description}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Cijena(kn)</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="number"
                            name="price" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                            value={values.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Trajanje(min)</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            type="number"
                            name="duration" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                            value={values.duration}
                            onChange={handleChange}
                            isInvalid={!!errors.duration}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.duration}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                      <Row>
                        <Col sm={12}>
                          <Form.Label>
                            <b>Određeni spol</b>
                          </Form.Label>
                        </Col>
                        <Col sm={12}>
                          <Form.Control
                            as="select"
                            name="intendedGender" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                            value={values.intendedGender}
                            onChange={handleChange}
                            isInvalid={!!errors.intendedGender}
                          >
                            <option value="M">M</option>
                            <option value="Ž">Ž</option>
                          </Form.Control>

                          <Form.Control.Feedback type="invalid">
                            {errors.intendedGender}
                          </Form.Control.Feedback>
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

export default AppointmentType;
