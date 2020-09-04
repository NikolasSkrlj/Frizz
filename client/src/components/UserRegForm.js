import React, { useState, useEffect } from "react";
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
    .required("Ime je obavezno"),
  age: yup
    .number()
    .min(18, "Morate imate minimalno 18 godina")
    .required("Dob je obavezna"),
  email: yup.string().email("Neispravan e-mail").required("E-mail je obavezan"),
});

const UserRegForm = () => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        console.log(values);
      }}
      validateOnChange={false}
      initialValues={{}}
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
        <Form
          noValidate
          onSubmit={handleSubmit}
          className="w-50 mx-auto text-left"
        >
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
            <Form.Group as={Col} md="12" controlId="email">
              <Form.Label>E-mail</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                </InputGroup.Prepend>
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
              </InputGroup>
            </Form.Group>
          </Form.Row>

          <Button type="submit" variant="info">
            Potvrdi
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserRegForm;
