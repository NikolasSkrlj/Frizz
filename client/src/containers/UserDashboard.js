import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, withRouter, useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserDashboard = () => {
  const history = useHistory();
  const { userType } = useContext(GlobalContext);
  const [sidebarToggled, setSidebarToggled] = useState(true);

  useEffect(() => {
    if (!userType || userType === "hairsalon") {
      console.log("You're not allowed to be here");
      history.push("/");
    }
  });
  const handleClick = () => {
    setSidebarToggled(!sidebarToggled);
  };
  return (
    <>
      <Container fluid>
        <Sidebar isToggled={sidebarToggled} />
        <Container fluid className="pt-5">
          <div class="page-content p-5" id="content">
            {/*  <!-- Toggle button --> */}
            <button
              id="sidebarCollapse"
              type="button"
              class="btn btn-light bg-white d-md-none rounded-pill shadow-sm px-4 mb-4"
              onClick={handleClick}
            >
              <i class="fa fa-bars mr-2"></i>
              <small class="text-uppercase font-weight-bold">Toggle</small>
            </button>

            {/*  <!-- Demo content --> */}
            <h2 class="display-4 text-white">Bootstrap vertical nav</h2>
            <p class="lead text-white mb-0">
              Build a fixed sidebar using Bootstrap 4 vertical navigation and
              media objects.
            </p>
            <p class="lead text-white">
              Snippet by{" "}
              <a href="https://bootstrapious.com/snippets" class="text-white">
                <u>Bootstrapious</u>
              </a>
            </p>
            <div class="separator"></div>
            <div class="row text-white">
              <div class="col-lg-7">
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor.
                </p>
                <div class="bg-white p-5 rounded my-5 shadow-sm">
                  <p class="lead font-italic mb-0 text-muted">
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum."
                  </p>
                </div>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor.
                </p>
              </div>
              <div class="col-lg-5">
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <p class="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Container>
    </>
  );
};
/*
  
*/

export default UserDashboard;
