import React, { Component } from "react";
import { Jumbotron, Button } from "react-bootstrap";

import { Link, NavLink, withRouter } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <Jumbotron>
        <h1>Dobrodošli na Frizz.hr</h1>
        <p>
          kod nas možete pretraživati frizerske salone u vašoj blizini,
          rezervirati termine itd.
        </p>
        <p>
          <Button
            variant="secondary"
            as={Link}
            to="/user"
            className="mr-2 center"
          >
            Registriraj svoj salon
          </Button>
          <Button variant="secondary">Registriraj se kao korisnik</Button>
        </p>
      </Jumbotron>
    </div>
  );
};
export default withRouter(LandingPage);
