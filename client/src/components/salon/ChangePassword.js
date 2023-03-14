import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import { Spinner, Button, Alert, Form, Row, Col } from "react-bootstrap";

import { Formik } from "formik";
import * as yup from "yup";

const passwordSchema = yup.object({
  oldPassword: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .required("Obavezno polje!"),
  newPassword: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .required("Obavezno polje!"),
  repeatedNewPassword: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .oneOf([yup.ref("newPassword"), null], "Lozinke se ne podudaraju")
    .required("Obavezno polje!"),
});

const ChangePassword = () => {
  const { authToken } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async ({ oldPassword, newPassword }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/hairsalon/change_password`,
        {
          oldPassword,
          newPassword,
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
    <Formik
      validationSchema={passwordSchema}
      onSubmit={(values, props) => {
        //console.log(values);
        handleSubmit(values);
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
        setErrors,
        setValues,
      }) => (
        <Row className={`${window.innerWidth <= 765 && "mt-3"}`}>
          <Form noValidate onSubmit={handleSubmit} className="text-left w-100">
            <Col md={{ span: 12 }}>
              <Form.Row>
                <Form.Group as={Col} md="12" controlId="staralozinka">
                  <Form.Label>Stara lozinka</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Stara lozinka"
                    name="oldPassword"
                    value={values.oldPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.oldPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.oldPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="novalozinka">
                  <Form.Label>Nova lozinka</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Nova lozinka"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.newPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="novaponovljenalozinka">
                  <Form.Label>Ponovljena nova lozinka</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Ponovljena nova lozinka"
                    name="repeatedNewPassword"
                    value={values.repeatedNewPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.repeatedNewPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.repeatedNewPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Alert
                variant={submitSuccess ? "success" : "danger"}
                show={messageToggled}
              >
                {message}
              </Alert>

              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  variant="info"
                  className="w-100"
                  disabled={submitSuccess}
                >
                  Promijeni
                </Button>
              </div>
            </Col>
          </Form>
        </Row>
      )}
    </Formik>
  );
};

export default ChangePassword;
