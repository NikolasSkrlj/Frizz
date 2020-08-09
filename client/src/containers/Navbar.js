import React, { useContext } from "react";
import { Navbar, Nav, Button, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

const NavbarContainer = () => {
  const { toggleShowLoginModal, isLoggedIn } = useContext(GlobalContext);
  console.log("da vidimo ", isLoggedIn);
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand as={Link} to="/">
        Frizz.hr
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">
          Naslovna
        </Nav.Link>
      </Nav>
      <Nav className="mr-sm-2">
        {console.log(isLoggedIn)}
        {isLoggedIn ? (
          <Nav.Link onClick={() => console.log("handler za odjavu")}>
            Odjava
          </Nav.Link>
        ) : (
          <Nav.Link onClick={() => toggleShowLoginModal()}>Prijava</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default NavbarContainer;
