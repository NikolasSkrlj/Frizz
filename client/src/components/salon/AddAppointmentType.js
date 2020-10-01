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

const AddAppointmentType = ({ updateAppTypes, toggleAdd }) => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      const res = await axios.post(
        `/hairsalon/add_appointmentType`,
        {
          name,
          price,
          intendedGender,
          duration,
          description,
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
        toggleAdd();
        updateAppTypes((prev) => !prev);
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

  return (
    <Card className="my-3">
      <Card.Body>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => {
            //console.log(values);
            handleSubmit(values);
          }}
          validateOnChange={false}
          initialValues={{
            name: "",
            price: 0,
            duration: 0,
            intendedGender: "M",
            description: "",
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
                          placeholder="muško šišanje"
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
                          placeholder="Jednostavno šišanje koje kratko traje"
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

                  <Row>
                    <Col>
                      <Button
                        type="reset"
                        variant="danger"
                        className="mr-1 w-100"
                        onClick={() => {
                          setValues(initialValues);
                          setErrors({});
                          toggleAdd();
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
                </Col>
              </Form>
            </Row>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default AddAppointmentType;
