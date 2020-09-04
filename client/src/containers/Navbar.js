import React, { useContext, useEffect } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import LoginModal from "./LoginModal";
import axios from "axios";

const NavbarContainer = () => {
  const {
    showLoginModal,
    toggleShowLoginModal,
    setUser,
    setAuthToken,
    toggleIsLoggedIn,
    isLoggedIn,
    user,
    authToken,
    userType,
    setUserType,
    salon,
    setSalon,
  } = useContext(GlobalContext);

  const history = useHistory();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `/${userType}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      //ovo da moze kod refresha ostat podaci vidljivi
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("loggedIn");
      sessionStorage.removeItem("userType");

      if (userType === "user") {
        setUser({});
      } else {
        setSalon({});
      }
      setAuthToken("");
      toggleIsLoggedIn();
      history.push("/");
    } catch (err) {
      if (err.response) {
        console.log("dap nesto se sjebalo", err);
      }
    }
  };

  return (
    <Navbar
      bg="info"
      variant="dark"
      expand="sm"
      className="shadow-sm"
      fixed="top"
      collapseOnSelect="true"
    >
      <Container>
        <LoginModal />

        <Navbar.Brand
          as={Link}
          to={isLoggedIn ? (userType === "user" ? "/user" : "/hairsalon") : "/"}
        >
          Frizz.hr
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link
              as={Link}
              to="/"
              className="d-flex justify-content-center"
            >
              Naslovna
            </Nav.Link> */}
          </Nav>
          <Nav className="mr-md-5">
            {isLoggedIn ? (
              /*  <Nav.Link
                className="d-flex justify-content-center"
                onClick={() => handleLogout()}
              >
                Odjava
              </Nav.Link> */
              <Button
                variant="outline-light"
                as={Link}
                onClick={() => handleLogout()}
                className="justify-content-sm-center"
              >
                Odjava
              </Button>
            ) : (
              <>
                {/* <Nav.Link
                  className="d-flex justify-content-center"
                  onClick={() => toggleShowLoginModal()}
                >
                  Prijava
                </Nav.Link> */}
                <Button
                  variant="outline-light"
                  as={Link}
                  onClick={() => toggleShowLoginModal()}
                  className="mr-1 my-1 justify-content-sm-center"
                >
                  Prijava
                </Button>
                <Button
                  variant="light"
                  as="a"
                  href="#reg"
                  className="ml-1 my-1 justify-content-sm-center text-muted"
                >
                  Registracija
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarContainer;
