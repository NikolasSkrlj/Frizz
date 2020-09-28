import React, { useState, useContext, useRef } from "react";
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

  const toggle = useRef();
  const toggleNav = () => {
    toggle.current.click();
  };

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
      history.push("/");
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
          to={
            isLoggedIn
              ? userType === "user"
                ? "/user/salons"
                : "/hairsalon/appointments"
              : "/"
          }
        >
          Frizz.hr
        </Navbar.Brand>
        <Navbar.Toggle ref={toggle} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="mr-auto">
            <Nav.Link></Nav.Link>
          </Nav> */}
          <Nav className="ml-auto">
            {isLoggedIn ? (
              <Button
                variant="outline-light"
                onClick={() => {
                  handleLogout();
                  if (window.innerWidth <= 765) {
                    toggleNav();
                  }
                }}
                className={`justify-content-sm-center ${
                  window.innerWidth <= 765 && "mt-3 mb-1"
                }`}
              >
                Odjava
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    toggleShowLoginModal();

                    // jer bootstrapavo ponasanje ne trpi bas buttone u navbaru ovako rucno zatvaramo navbar u moblinom prikazu
                    if (window.innerWidth <= 765) {
                      toggleNav();
                    }
                  }}
                  className="mx-1 my-1 justify-content-sm-center "
                >
                  Prijava
                </Button>

                <Button
                  variant="light"
                  eventKey="1"
                  href="#reg"
                  onClick={() => {
                    // jer bootstrapavo ponasanje ne trpi bas buttone u navbaru ovako rucno zatvaramo navbar u moblinom prikazu
                    if (window.innerWidth <= 765) {
                      toggleNav();
                    }
                  }}
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
