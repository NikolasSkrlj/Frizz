import React, { useContext, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
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

  useEffect(() => {
    console.log("Navbar se rendera!");
  });
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/${userType}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
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
    <Navbar bg="primary" variant="dark">
      <LoginModal />
      <Navbar.Brand
        as={Link}
        to={isLoggedIn ? (userType === "user" ? "/user" : "/hairsalon") : "/"}
      >
        Frizz.hr
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">
          Naslovna
        </Nav.Link>
      </Nav>
      <Nav className="mr-sm-2 outline-secondary">
        {isLoggedIn ? (
          <Nav.Link onClick={() => handleLogout()}>Odjava</Nav.Link>
        ) : (
          <Nav.Link onClick={() => toggleShowLoginModal()}>Prijava</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default NavbarContainer;
