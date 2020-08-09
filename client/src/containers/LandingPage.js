import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";
import UserDashboard from "./UserDashboard";
import { Link, NavLink, withRouter } from "react-router-dom";

const LandingPage = () => {
  return (
    <Jumbotron bg="light">
      <h1>Dobrodošli na Frizz.hr</h1>
      <p>
        kod nas možete pretraživati frizerske salone u vašoj blizini,
        rezervirati termine itd.
      </p>
      <p>
        <Button variant="primary" as={Link} to="/user" className="mr-2 center">
          Registriraj svoj salon
        </Button>
        <Button variant="secondary">Registriraj se kao korisnik</Button>
      </p>
    </Jumbotron>
  );
};
export default LandingPage;
