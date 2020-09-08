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
  Accordion,
  Image,
} from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { Formik } from "formik";
import * as yup from "yup";
import "./../styles/UserProfile.css";
import ChangePassword from "./../components/user/ChangePassword";
import UploadProfilePic from "./../components/user/UploadProfilePic";

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

const UserProfile = () => {
  const { authToken, user, setUser } = useContext(GlobalContext);
  //const [user, setUser] = useState({});

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
        setFetchSuccess(true);
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

  /*   useEffect(() => {
    setFetchSuccess(true);
  }, [user]);
 */
  const handleSubmit = async ({ fullName, email, age, gender, phone }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.put(
        `/user/${params.id}/update`,
        {
          email,
          age,
          gender,
          phone,
          name: fullName,
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
        setUser(res.data.user);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        setMessageToggled(true);
        setIsEditable(false);
        setTimeout(() => {
          setMessageToggled(false);
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      //ovdje treba provjera ako je kod specifican vratit poruku da user postoji
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
          <>
            <Formik
              validationSchema={schema}
              onSubmit={(values) => {
                //console.log(values);
                handleSubmit(values);
              }}
              validateOnChange={false}
              initialValues={{
                fullName: user.name,
                email: user.email,
                password: "placeholder",
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
                setErrors,
              }) => (
                <Row>
                  <Col sm={12}>
                    <div className="my-3 mx-auto text-center">
                      <Image
                        className="profile-pic"
                        src={
                          user.profilePic
                            ? `/user/${user._id}/profile_pic`
                            : user.gender === "M"
                            ? "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
                            : "https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
                        }
                        roundedCircle
                      />

                      <h5 className="mt-2">{user.name}</h5>
                      <div className="lead">korisnik</div>
                    </div>
                  </Col>

                  <fieldset disabled={!isEditable} className="w-100">
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className="text-left w-100"
                    >
                      <Col md={{ span: 12 }}>
                        <hr />
                        <br></br>
                        <Form.Row>
                          <Form.Group as={Col} md="12" controlId="ime">
                            <Row>
                              <Col sm={6}>
                                {" "}
                                <Form.Label>
                                  <b>Ime i prezime</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
                                {" "}
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
                              </Col>
                            </Row>
                          </Form.Group>
                          <hr />
                          <Form.Group as={Col} md="12" controlId="email">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>E-mail</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
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
                              </Col>
                            </Row>
                          </Form.Group>

                          <Form.Group as={Col} md="12" controlId="tel">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>Telefon</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
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
                              </Col>
                            </Row>
                          </Form.Group>
                          <Form.Group as={Col} md="12" controlId="dob">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>Dob</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
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
                              </Col>
                            </Row>
                          </Form.Group>
                          <Form.Group controlId="spol" as={Col} md="12">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>Spol</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
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
                              </Col>
                            </Row>
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
                                type="reset"
                                variant="danger"
                                className="mr-1 w-100"
                                onClick={() => {
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
            <hr />
            {/* Za promjenu lozinke */}
            <h3 className="my-4">Opcije</h3>
            <Row className="my-5">
              <Col sm={6}>
                <b>Promjena lozinke</b>
              </Col>
              <Col sm={6}>
                <ChangePassword />
              </Col>
            </Row>

            <Row className="my-5">
              <Col sm={6}>
                <b>Promjena profilne slike</b>
              </Col>
              <Col sm={6}>
                <UploadProfilePic />
              </Col>
            </Row>
            {/*  <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Promjena lozinke
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ChangePassword />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Promjena profilne slike
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <UploadProfilePic />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion> */}
          </>
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
