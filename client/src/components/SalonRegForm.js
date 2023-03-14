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
  Table,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

//yup je vanjski library za validaciju kojeg koristi formik i lagano je jer ima schemu ovako
const schema = yup.object({
  name: yup
    .string()
    .min(2, "Prekratko ime!")
    .max(25, "Predugo ime!")
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
    .min(6, "Unesite valjan tel. broj")
    .max(10, "Unesite valjan tel. broj")
    .required("Obavezno polje!"),
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
      }
    ),
  postalCode: yup
    .number()
    .min(10000, "Odaberite valjani poštanski broj(10000-53296)")
    .max(53296, "Odaberite valjani poštanski broj(10000-53296)")
    .required("Obavezno polje!"),
  street: yup.string().required("Obavezno polje!"),
  city: yup.string().required("Obavezno polje!"),
  county: yup.string().required("Obavezno polje!"),
});

const SalonRegForm = () => {
  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { toggleShowLoginModal } = useContext(GlobalContext);

  const handleSubmit = async ({
    name,
    description,
    email,
    password,
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

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/hairsalon/create`,
        {
          email,
          password,
          name,
          description,
          address,
          phone,
          workingHours: wh,
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
        setMessage(err.response.data.message);
        setMessageToggled(true);
      }
    }
  };

  const initWh = [
    {
      index: 1,
      dayName: "ponedjeljak",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 2,
      dayName: "utorak",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 3,
      dayName: "srijeda",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 4,
      dayName: "četvrtak",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 5,
      dayName: "petak",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 6,
      dayName: "subota",
      startWorktime: 0,
      endWorktime: 0,
    },
    {
      index: 7,
      dayName: "nedjelja",
      startWorktime: 0,
      endWorktime: 0,
    },
  ];

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        //console.log(values);
        handleSubmit(values);
      }}
      validateOnChange={false}
      initialValues={{
        name: "",
        description: "",
        email: "",
        phone: "",
        wh: initWh,
        street: "",
        postalCode: 0,
        city: "",
        county: "ZAGREBAČKA",
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
            <Col md={{ span: 6, offset: 3 }}>
              <Form.Row>
                <Form.Group as={Col} md="12" controlId="ime2">
                  <Form.Label>Naziv salona</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Naziv salona"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="desc">
                  <Form.Label>
                    Opis<small className="mx-1 text-muted">(opcionalno)</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Opis salona"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="email2">
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
                <Form.Group as={Col} md="12" controlId="lozinka2">
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
                <Form.Group as={Col} md="12" controlId="ponovljena2">
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
                <Form.Group as={Col} md="12" controlId="tel2">
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
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    Radno vrijeme <br />
                    <small className="text-muted">
                      Napomena: Neradni dan ima vrijednosti Od i Do jednake 0.
                    </small>
                  </Form.Label>

                  <Table striped bordered hover className="text-center">
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
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Ulica i broj</Form.Label>

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
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Poštanski broj</Form.Label>

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
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Form.Label>Grad/Općina</Form.Label>

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
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Form.Label>Županija</Form.Label>

                  <Form.Control
                    as="select"
                    name="county"
                    id="county"
                    value={values.county}
                    onChange={handleChange}
                    isInvalid={!!errors.county}
                  >
                    <option value="ZAGREBAČKA">ZAGREBAČKA</option>
                    <option value="KRAPINSKO-ZAGORSKA">
                      KRAPINSKO-ZAGORSKA
                    </option>
                    <option value="SISAČKO-MOSLAVAČKA">
                      SISAČKO-MOSLAVAČKA
                    </option>
                    <option value="KARLOVAČKA">KARLOVAČKA</option>
                    <option value="VARAŽDINSKA">VARAŽDINSKA</option>
                    <option value="KOPRIVNIČKO-KRIŽEVAČKA">
                      KOPRIVNIČKO-KRIŽEVAČKA
                    </option>
                    <option value="BJELOVARSKO-BILOGORSKA">
                      BJELOVARSKO-BILOGORSKA
                    </option>
                    <option value="PRIMORSKO-GORANSKA">
                      PRIMORSKO-GORANSKA
                    </option>
                    <option value="LIČKO-SENJSKA">LIČKO-SENJSKA</option>
                    <option value="VIROVITIČKO-PODRAVSKA">
                      VIROVITIČKO-PODRAVSKA
                    </option>
                    <option value="POŽEŠKO-SLAVONSKA">POŽEŠKO-SLAVONSKA</option>
                    <option value="BRODSKO-POSAVSKA">BRODSKO-POSAVSKA</option>
                    <option value="ZADARSKA">ZADARSKA</option>
                    <option value="OSJEČKO-BARANJSKA">OSJEČKO-BARANJSKA</option>
                    <option value="ŠIBENSKO-KNINSKA">ŠIBENSKO-KNINSKA</option>
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
                    <option value="MEĐIMURSKA">MEĐIMURSKA</option>
                    <option value="GRAD ZAGREB">GRAD ZAGREB</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.county}
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

export default SalonRegForm;
