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

const AddHairdresser = ({ updateHairdressers, toggleAdd }) => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async ({ name, phone, wd }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/hairsalon/add_hairdresser`,
        {
          name,
          phone,
          workDays: wd,
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
        updateHairdressers((prev) => !prev);
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
  const initWd = [
    {
      index: 1,
      dayName: "ponedjeljak",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 2,
      dayName: "utorak",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 3,
      dayName: "srijeda",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 4,
      dayName: "četvrtak",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 5,
      dayName: "petak",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 6,
      dayName: "subota",
      startTime: 0,
      endTime: 0,
    },
    {
      index: 7,
      dayName: "nedjelja",
      startTime: 0,
      endTime: 0,
    },
  ];
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
            phone: "",
            wd: initWd,
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

export default AddHairdresser;
