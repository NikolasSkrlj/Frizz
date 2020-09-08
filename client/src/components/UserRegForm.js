import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import {
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

//yup je vanjski library za validaciju kojeg koristi formik i lagano je jer ima schemu ovako
const schema = yup.object({
  fullName: yup
    .string()
    .min(2, "Prekratko ime!")
    .max(25, "Predugo ime!")
    .required("Obavezno polje!"),
  age: yup
    .number()
    .min(18, "Morate imati minimalno 18 godina")

    .required("Obavezno polje!"),
  email: yup.string().email("Neispravan e-mail").required("Obavezno polje!"),
  password: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .required("Obavezno polje!"),
  repeatedPass: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .oneOf([yup.ref("password"), null], "Lozinke se ne podudaraju")
    .required("Obavezno polje!"),
  phone: yup
    .string()
    .min(9, "Unesite valjan tel. broj")
    .max(10, "Unesite valjan tel. broj")
    .required("Obavezno polje!"),
  gender: yup
    .string()
    .required("Obavezno polje!")
    .test("test-name", "Odaberite jedan od spolova", (value) => {
      return value !== "Odaberi";
    }),
});

const UserRegForm = () => {
  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { toggleShowLoginModal } = useContext(GlobalContext);

  const handleSubmit = async ({
    fullName,
    email,
    password,
    age,
    gender,
    repeatedPass,
    phone,
  }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.post(`/user/create`, {
        email,
        password,
        age,
        gender,
        repeatedPass,
        phone,
        name: fullName,
      });
      if (res.data.success) {
        setSubmitSuccess(true);
        setMessage(res.data.message);
        setMessageToggled(true);
      }
    } catch (err) {
      //ovdje treba provjera ako je kod specifican vratit poruku da user postoji
      if (err.response) {
        setSubmitSuccess(false);
        setMessage(err.response.data.message);
        setMessageToggled(true);
      }
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        console.log(values);
        handleSubmit(values);
      }}
      validateOnChange={false}
      initialValues={{
        gender: "Odaberi",
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
      }) => (
        <Row>
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="mx-auto text-left"
          >
            <Col md={{ span: 4, offset: 4 }}>
              <Form.Row>
                <Form.Group as={Col} md="12" controlId="ime">
                  <Form.Label>Ime i prezime</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Vaše ime i prezime"
                    value={values.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="email">
                  <Form.Label>E-mail</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Vaš e-mail"
                    aria-describedby="inputGroupPrepend"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="lozinka">
                  <Form.Label>Lozinka</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Vaša lozinka"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="ponovljena">
                  <Form.Label>Ponovljena lozinka</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Vaša lozinka"
                    name="repeatedPass"
                    value={values.repeatedPass}
                    onChange={handleChange}
                    isInvalid={!!errors.repeatedPass}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.repeatedPass}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="tel">
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Telefonski broj"
                    value={values.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="dob">
                  <Form.Label>Dob</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    placeholder="Vaša dob"
                    value={values.age}
                    onChange={handleChange}
                    isInvalid={!!errors.age}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.age}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="spol" as={Col} md="12">
                  <Form.Label>Spol</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="Odaberi">Odaberi</option>
                    <option value="M">M</option>
                    <option value="Ž">Ž</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Alert
                variant={submitSuccess ? "success" : "danger"}
                show={messageToggled}
              >
                {message}
                {submitSuccess && (
                  <Button
                    variant="link"
                    className="text-info m-2"
                    onClick={() => toggleShowLoginModal()}
                  >
                    Prijavi se
                  </Button>
                )}
              </Alert>

              <Button type="submit" variant="info" className="d-block w-100">
                Potvrdi
              </Button>
            </Col>
          </Form>
        </Row>
      )}
    </Formik>
  );
};

export default UserRegForm;
