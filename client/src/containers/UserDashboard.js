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
import DummyContent from "../containers/DummyContent";
import "../styles/Navbar.css";

const UserDashboard = () => {
  const history = useHistory();
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const { path, url } = useRouteMatch();

  const base = "page-content p-4 ";
  const classNameHtml = !sidebarToggled ? base + " active" : base; // kad sidebar i content ima klasu active onda je sidebar sakriven i content full screen sa gumbom

  const handleClick = () => {
    setSidebarToggled(!sidebarToggled);
  };
  return (
    <>
      <Container fluid>
        <Sidebar isToggled={sidebarToggled} closeSidebarOnClick={handleClick} />
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

            <Switch>
              <Route path={`${path}/saloni`} component={Salon} />
              <Route path={path} component={DummyContent} />
            </Switch>
          </div>
        </Container>
      </Container>
    </>
  );
};
/*
  
*/

export default UserDashboard;
