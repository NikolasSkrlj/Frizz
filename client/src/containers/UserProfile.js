import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import axios from "axios";
import {
  Card,
  Spinner,
  Button,
  Alert,
  Form,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
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
    .min(18, "Morate imati minimalno 18 godina")

    .required("Dob je obavezna"),
  email: yup.string().email("Neispravan e-mail").required("E-mail je obavezan"),
  password: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .required("Lozinka je obavezna"),
  repeatedPass: yup
    .string()
    .min(7, "Mora sadržavati 7 ili više znakova")
    .oneOf([yup.ref("password"), null], "Lozinke se ne podudaraju")
    .required("Ponovljena lozinka je obavezna"),
  phone: yup
    .string()
    .min(9, "Unesite valjan tel. broj")
    .max(10, "Unesite valjan tel. broj")
    .required("Tel. broj je obavezan"),
  gender: yup
    .string()
    .required("Spol je obavezan")
    .test("test-name", "Odaberite jedan od spolova", (value) => {
      return value !== "Odaberi";
    }),
});

const UserProfile = () => {
  const { authToken } = useContext(GlobalContext);
  const [user, setUser] = useState({});

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug
  const params = useParams();

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get(`/user/${params.id}/profile`, {
          // ovo mozemo jer smo stavili proxy u package.json
          headers: {
            Authorization: authToken,
          },
        });

        setUser(res.data.user);
        setIsLoading(false);
      } catch (err) {
        if (err.response) {
          setFetchSuccess(false);
          setIsLoading(false);
        }
      }
    };
    getData();
  }, []);

  useEffect(() => {
    setFetchSuccess(true);
  }, [user]);

  const handleSubmit = async () => {
    console.log("ok");
  };
  return (
    <Card>
      <Card.Header className="d-flex">
        <h3 className="align-self-start"> Profil</h3>

        <Button
          variant="secondary"
          className="ml-auto"
          onClick={() => {
            setIsEditable(true);
          }}
        >
          Uredi <FaUserEdit className="ml-2 pb-1" />
        </Button>
      </Card.Header>

      <Card.Body>
        {isLoading ? (
          <div className="text-center text-muted justify-content-center">
            <h6 className="pb-2">...Učitavanje profila...</h6>
            <Spinner animation="border" variant="info" />
          </div>
        ) : fetchSuccess ? (
          <Formik
            validationSchema={schema}
            onSubmit={(values) => {
              console.log(values);
              handleSubmit(values);
            }}
            validateOnChange={false}
            initialValues={{
              fullName: user.name,
              email: user.email,
              password: user.password,
              repeatedPass: user.repeatedPass,
              gender: user.gender,
              age: user.age,
              phone: user.phone,
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
                <fieldset disabled={!isEditable}>
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    className="mx-auto text-left"
                  >
                    <Col md={{ span: 12 }}>
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
                        <hr />
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
                      </Alert>
                      {isEditable && (
                        <Row>
                          <Col>
                            <Button
                              type="button"
                              variant="danger"
                              className="mr-1 w-100"
                              onClick={() => setIsEditable(false)}
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
        ) : (
          <Alert variant="danger">
            <Alert.Heading>Došlo je do pogreške!</Alert.Heading>
            <p>Molimo osvježite stranicu!</p>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
