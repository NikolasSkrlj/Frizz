import React, { useState, useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import {
  Link,
  withRouter,
  useHistory,
  useRouteMatch,
  useParams,
  Route,
  Switch,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Salon from "../components/user/Salon";
import "../styles/Navbar.css";

const UserDashboard = () => {
  const history = useHistory();
  //const { userType } = useContext(GlobalContext);
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const match = useRouteMatch();
  console.log(match);
  const params = useParams();
  console.log(params);

  const base = "page-content p-4 ";
  const classNameHtml = !sidebarToggled ? base + " active" : base; // kad sidebar i content ima klasu active onda je sidebar sakriven i content full screen sa gumbom

  const handleClick = () => {
    setSidebarToggled(!sidebarToggled);
  };
  return (
    <>
      <Container fluid>
        <Sidebar isToggled={sidebarToggled} />
        <Container fluid className="pt-5 ">
          <div className={classNameHtml} id="content">
            {/*  <!-- Toggle button --> */}
            <button
              id="sidebarCollapse"
              type="button"
              className="btn btn-light bg-white d-md-none rounded-pill shadow-sm px-4 position-fixed fixed-left toggle-button"
              onClick={handleClick}
            >
              <FaBars />
            </button>
            <div className="pt-5">
              {/*  <!-- Demo content --> */}
              <h2 className="display-4 text-white">Ovo je dummy content</h2>
              <p className="lead text-white mb-0">
                Nesto lijepo mora da se desi.
                <ul>
                  <li>
                    <Link to={`${match.url}/user`}>User</Link>
                  </li>
                </ul>
              </p>

              <div className="separator"></div>
              <div className="row text-white">
                <div className="col-lg-7">
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor.
                  </p>
                  <div className="bg-white p-5 rounded my-5 shadow-sm">
                    <p className="lead font-italic mb-0 text-muted">
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum."
                    </p>
                  </div>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor.
                  </p>
                </div>
                <div className="col-lg-5">
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p className="lead">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Switch>
            <Route path={`${match}/user`} component={Salon} />
          </Switch>
        </Container>
      </Container>
    </>
  );
};
/*
  
*/

export default UserDashboard;
