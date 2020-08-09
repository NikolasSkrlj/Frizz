import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import axios from "axios";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //kontroliramo ako se prikazuje modal sa globalni contextom, jednsotavni bool na temelju kojeg togglamo
  const { showLoginModal, toggleShowLoginModal } = useContext(GlobalContext);

  const handleLogin = (e) => {
    e.preventDefault();

    const getRes = async () => {
      const res = await axios.post("http://localhost:4000/user/login", {
        email,
        password,
      });
      console.log(res.data);
    };
    getRes();
  };

  return (
    <Modal show={showLoginModal} onHide={toggleShowLoginModal}>
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
              placeholder="Lozinka"
              required
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <Form.Text className="text-muted">
              Mora sadržavati minimalno 8 znakova
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Zapamti me(opcionalno)" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Prijavi se
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
