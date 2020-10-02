import React, { useState, useContext, useEffect } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import {
  Card,
  Spinner,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Table,
  Image,
} from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { Formik } from "formik";
import * as yup from "yup";
//import "./../styles/UserProfile.css";
import ChangePassword from "./ChangePassword";
//import UploadProfilePic from "./../components/user/UploadProfilePic";

//yup je vanjski library za validaciju kojeg koristi formik i lagano je jer ima schemu ovako
const schema = yup.object({
  name: yup
    .string()
    .min(2, "Prekratko ime!")
    .max(25, "Predugo ime!")
    .required("Obavezno polje!"),
  email: yup.string().email("Neispravan e-mail").required("Obavezno polje!"),
  wh: yup
    .array()
    .required("Obavezno polje!")
    .test(
      "test-name",
      "Početak i kraj radnog vremena mogu biti vrijednosti od 0-23",
      (value) => {
        for (const day of value) {
          if (!day.startWorktime) continue;
          if (
            day.startWorktime < 0 ||
            day.startWorktime > 23 ||
            day.endWorktime < 0 ||
            day.endWorktime > 23
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
    .min(6, "Unesite valjan tel. broj")
    .max(10, "Unesite valjan tel. broj")
    .required("Obavezno polje!"),
  postalCode: yup
    .number()
    .min(10000, "Odaberite valjani poštanski broj(10000-53296)")
    .max(53296, "Odaberite valjani poštanski broj(10000-53296)")
    .required("Obavezno polje!"),
  street: yup.string().required("Obavezno polje!"),
  city: yup.string().required("Obavezno polje!"),
  county: yup.string().required("Obavezno polje!"),
});

const SalonProfile = () => {
  const { authToken, salon, setSalon } = useContext(GlobalContext);

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get(`/hairsalon/get_profile`, {
          // ovo mozemo jer smo stavili proxy u package.json
          headers: {
            Authorization: authToken,
          },
        });

        setSalon(res.data.salon);
        sessionStorage.setItem("salon", JSON.stringify(res.data.salon));
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

  const handleSubmit = async ({
    name,
    description,
    email,
    phone,
    street,
    city,
    county,
    wh,
    postalCode,
  }) => {
    setMessageToggled(false);
    setMessage("");
    try {
      const address = { street, postalCode, city, county };
      // console.log(address);

      const res = await axios.put(
        `/hairsalon/update_profile`,
        {
          email,
          name,
          description,
          address,
          phone,
          workingHours: wh,
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
        setSalon(res.data.salon);
        sessionStorage.setItem("salon", JSON.stringify(res.data.salon));
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
    <Card style={{ minHeight: "100vh" }}>
      <Card.Header className="d-flex ">
        <h3 className="align-self-start">Salon</h3>

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
            <h6 className="pb-2">...Učitavanje salona...</h6>
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
                name: salon.name,
                description: salon.description,
                email: salon.email,
                phone: salon.phone,
                wh: salon.workingHours,
                street: salon.address.street,
                postalCode: salon.address.postalCode,
                city: salon.address.city,
                county: salon.address.county,
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
                  <Col sm={12}>
                    <div className="my-3 mx-auto text-center">
                      <Image
                        className="profile-pic"
                        src="https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
                        roundedCircle
                      />

                      <h5 className="mt-2">{salon.name}</h5>
                      <div className="lead">salon</div>
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
                                  <b>Naziv salona</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
                                {" "}
                                <Form.Control
                                  type="text"
                                  name="name"
                                  placeholder="Ime salona"
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
                          <Form.Group as={Col} md="12" controlId="desc">
                            <Row>
                              <Col sm={6}>
                                {" "}
                                <Form.Label>
                                  <b>Opis salona</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
                                {" "}
                                <Form.Control
                                  type="text"
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
                          <Form.Group as={Col} md="12">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>Radno vrijeme</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
                                <Table
                                  striped
                                  bordered
                                  hover
                                  className="text-center"
                                >
                                  <thead>
                                    <tr>
                                      <th>Dan</th>
                                      <th>Početak</th>
                                      <th>Kraj</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>ponedjeljak</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[0].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[0].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[0].endWorktime"
                                          value={values.wh[0].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>utorak</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[1].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[1].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[1].endWorktime"
                                          value={values.wh[1].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>srijeda</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[2].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[2].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[2].endWorktime"
                                          value={values.wh[2].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>četvrtak</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[3].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[3].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[3].endWorktime"
                                          value={values.wh[3].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>petak</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[4].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[4].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[4].endWorktime"
                                          value={values.wh[4].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>subota</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[5].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[5].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[5].endWorktime"
                                          value={values.wh[5].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>nedjelja</td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[6].startWorktime" // ovako se pristupa nested strukturama array + object u formiku, za kontroliranje pojedinacnih objekata u arrayu
                                          value={values.wh[6].startWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                      <td>
                                        <Form.Control
                                          type="number"
                                          name="wh[6].endWorktime"
                                          value={values.wh[6].endWorktime}
                                          onChange={handleChange}
                                          isInvalid={!!errors.wh}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                          {errors.wh}
                                        </Form.Control.Feedback>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </Form.Group>
                          <Form.Group as={Col} md="12">
                            <Row>
                              <Col sm={6}>
                                <Form.Label>
                                  <b>Adresa</b>
                                </Form.Label>
                              </Col>
                              <Col sm={6}>
                                <Row className="mb-2">
                                  <Col sm={4}>
                                    <Form.Label>
                                      <b>Ulica i broj</b>
                                    </Form.Label>
                                  </Col>
                                  <Col sm={8}>
                                    <Form.Control
                                      type="text"
                                      name="street"
                                      id="street"
                                      placeholder="Ulica i broj"
                                      value={values.street}
                                      onChange={handleChange}
                                      isInvalid={!!errors.street}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.street}
                                    </Form.Control.Feedback>
                                  </Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col sm={4}>
                                    <Form.Label>
                                      <b>Poštanski broj</b>
                                    </Form.Label>
                                  </Col>
                                  <Col sm={8}>
                                    <Form.Control
                                      type="number"
                                      name="postalCode"
                                      id="postalCode"
                                      placeholder="Poštanski broj"
                                      value={values.postalCode}
                                      onChange={handleChange}
                                      isInvalid={!!errors.postalCode}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.postalCode}
                                    </Form.Control.Feedback>
                                  </Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col sm={4}>
                                    <Form.Label>
                                      <b>Grad/Općina</b>
                                    </Form.Label>
                                  </Col>
                                  <Col sm={8}>
                                    <Form.Control
                                      type="text"
                                      name="city"
                                      placeholder="Grad/Općina"
                                      value={values.city}
                                      id="city"
                                      onChange={handleChange}
                                      isInvalid={!!errors.city}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.city}
                                    </Form.Control.Feedback>
                                  </Col>
                                </Row>
                                <Row className="mb-2">
                                  <Col sm={4}>
                                    <Form.Label>
                                      <b>Županija</b>
                                    </Form.Label>
                                  </Col>
                                  <Col sm={8}>
                                    <Form.Control
                                      as="select"
                                      name="county"
                                      id="county"
                                      value={values.county}
                                      onChange={handleChange}
                                      isInvalid={!!errors.county}
                                    >
                                      <option value="ZAGREBAČKA">
                                        ZAGREBAČKA
                                      </option>
                                      <option value="KRAPINSKO-ZAGORSKA">
                                        KRAPINSKO-ZAGORSKA
                                      </option>
                                      <option value="SISAČKO-MOSLAVAČKA">
                                        SISAČKO-MOSLAVAČKA
                                      </option>
                                      <option value="KARLOVAČKA">
                                        KARLOVAČKA
                                      </option>
                                      <option value="VARAŽDINSKA">
                                        VARAŽDINSKA
                                      </option>
                                      <option value="KOPRIVNIČKO-KRIŽEVAČKA">
                                        KOPRIVNIČKO-KRIŽEVAČKA
                                      </option>
                                      <option value="BJELOVARSKO-BILOGORSKA">
                                        BJELOVARSKO-BILOGORSKA
                                      </option>
                                      <option value="PRIMORSKO-GORANSKA">
                                        PRIMORSKO-GORANSKA
                                      </option>
                                      <option value="LIČKO-SENJSKA">
                                        LIČKO-SENJSKA
                                      </option>
                                      <option value="VIROVITIČKO-PODRAVSKA">
                                        VIROVITIČKO-PODRAVSKA
                                      </option>
                                      <option value="POŽEŠKO-SLAVONSKA">
                                        POŽEŠKO-SLAVONSKA
                                      </option>
                                      <option value="BRODSKO-POSAVSKA">
                                        BRODSKO-POSAVSKA
                                      </option>
                                      <option value="ZADARSKA">ZADARSKA</option>
                                      <option value="OSJEČKO-BARANJSKA">
                                        OSJEČKO-BARANJSKA
                                      </option>
                                      <option value="ŠIBENSKO-KNINSKA">
                                        ŠIBENSKO-KNINSKA
                                      </option>
                                      <option value="VUKOVARSKO-SRIJEMSKA">
                                        VUKOVARSKO-SRIJEMSKA
                                      </option>
                                      <option value="SPLITSKO-DALMATINSKA">
                                        SPLITSKO-DALMATINSKA
                                      </option>
                                      <option value="ISTARSKA">ISTARSKA</option>
                                      <option value="DUBROVAČKO-NERETVANSKA">
                                        DUBROVAČKO-NERETVANSKA
                                      </option>
                                      <option value="MEĐIMURSKA">
                                        MEĐIMURSKA
                                      </option>
                                      <option value="GRAD ZAGREB">
                                        GRAD ZAGREB
                                      </option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                      {errors.county}
                                    </Form.Control.Feedback>
                                  </Col>
                                </Row>
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
            <hr />
            {/* Za promjenu lozinke */}
            <h3 className="my-4">Opcije</h3>
            <Row className="my-5">
              <Col sm={6}>
                <b>Promjena lozinke</b>
              </Col>
              <Col sm={6}>{<ChangePassword updateSalon={setIsUpdated} />}</Col>
            </Row>

            <Row className="my-5">
              {/* <Col sm={6}>
                <b>Promjena profilne slike</b>
              </Col>
              <Col sm={6}>
                <UploadProfilePic />
              </Col> */}
            </Row>
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

export default SalonProfile;
