import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { Link, withRouter, useHistory } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import axios from "axios";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successCheck, setSuccessCheck] = useState(true);
  const [userTypeRadio, setUserTypeRadio] = useState("user");
  //kontroliramo ako se prikazuje modal sa globalni contextom, jednsotavni bool na temelju kojeg togglamo
  const {
    showLoginModal,
    toggleShowLoginModal,
    setUser,
    setAuthToken,
    toggleIsLoggedIn,
    setUserType,
    setSalon,
  } = useContext(GlobalContext);

  const history = useHistory();
  /*  useEffect(() => {
    console.log("render");
  }); */
  const handleLogin = async (e) => {
    e.preventDefault();
    //setSuccessCheck(true);
    //ako je uspjesan login redirecta se na user dashboard inace se mora poruka pokazat, u context se stavljaju podacu o useru/salonu
    try {
      const res = await axios.post(`/${userTypeRadio}/login`, {
        email,
        password,
      });

      setAuthToken(res.data.token);
      if (userTypeRadio === "user") {
        setUser(res.data.user);
      } else {
        setSalon(res.data.salon);
      }
      toggleIsLoggedIn();
      toggleShowLoginModal();
      setUserType(userTypeRadio);
      history.push(`/${userTypeRadio}`);
    } catch (err) {
      if (err.response) {
        console.log("dap nesto se sjebalo", err);
        setSuccessCheck(!successCheck);
      }
    }
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    e.target.checked = true;
    console.warn(e.target.checked);
    setUserTypeRadio(value);
    console.warn("kliknuto i postavljeno");
  };
  return (
    <Modal
      show={showLoginModal}
      onHide={toggleShowLoginModal}
      onClick={() => {
        //koristimo event bubbling, kontrola je li prikazan error o uspjesnosti, nakon pogreske klikom na formu nestat ce error
        setSuccessCheck(true);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Prijavi se</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email adresa</Form.Label>
            <Form.Control
              type="email"
              placeholder="ivan.horvat@primjer.com"
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control
              type="password"
              placeholder="kotešiša"
              required
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <Form.Text className="text-muted">
              Mora sadržavati minimalno 8 znakova
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="radio"
              name="usertype"
              value="user"
              label="Kao korisnik"
              checked={userTypeRadio === "user" ? true : false}
              onClick={handleRadioChange}
            />

            <Form.Check
              type="radio"
              name="usertype"
              value="hairsalon"
              checked={userTypeRadio === "user" ? false : true}
              label="Kao admin salona"
              onClick={handleRadioChange}
            />
          </Form.Group>

          {successCheck ? (
            <div></div>
          ) : (
            <Alert variant="danger">
              Greška sa prijavom. Molimo provjerite email i/ili lozinku i
              pokušajte ponovo.
            </Alert>
          )}

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Zapamti me(opcionalno)" />
          </Form.Group>
          <Button variant="info" type="submit">
            Prijavi se
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
