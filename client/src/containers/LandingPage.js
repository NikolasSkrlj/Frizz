import React, { Component } from "react";
import { Jumbotron, Button, Container } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { Link, NavLink, withRouter } from "react-router-dom";

const LandingPage = () => {
  return (
    <Jumbotron bg="light">
      <Container>
        <h1 className="display-4 py-3">Dobrodošli na moje skromne stranice</h1>
        <p className="lead">
          Pronađite svog novog omiljenog frizera u svega nekoliko klikova
        </p>

        <p>
          <Button
            variant="info"
            as={Link}
            to="/user"
            className="mx-2 my-2 justify-content-sm-center"
          >
            Registriraj svoj salon
          </Button>
          <Button variant="secondary">Registriraj se kao korisnik</Button>
        </p>
      </Container>
    </Jumbotron>
  );
};
export default LandingPage;
