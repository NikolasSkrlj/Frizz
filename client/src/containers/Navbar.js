import React, { useState, useContext, useEffect } from "react";
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

  const [toggled, setToggled] = useState(false);
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
        sessionStorage.removeItem("user");
        setUser({});
      } else {
        sessionStorage.removeItem("salon");
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

  /*
    kad je u mobilnom prikazu navbar se nece collapsat na pritisak linka jer se koriste buttoni a ne Nav.link 
    a njih ne koristim jer se nemogu normalno stilizirat kao buttoni
  */
  return (
    <Navbar
      bg="info"
      variant="dark"
      expand="sm"
      className="shadow-sm"
      fixed="top"
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
          <Nav className="mr-auto"></Nav>
          <Nav className="mr-md-5">
            {isLoggedIn ? (
              <Button
                data-toggle="collapse"
                data-target="#basic-navbar-nav"
                variant="outline-light"
                onClick={() => handleLogout()}
                className="justify-content-sm-center"
              >
                Odjava
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    toggleShowLoginModal();
                  }}
                  className="mx-1 my-1 justify-content-sm-center "
                  eventKey="1"
                >
                  Prijava
                </Button>
                <Button
                  variant="light"
                  eventKey="1"
                  href="#reg"
                  className="mx-1 my-1 justify-content-sm-center text-muted "
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
