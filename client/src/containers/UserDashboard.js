import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaBars, FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
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
import SalonFeed from "../components/user/SalonFeed";
import UserProfile from "./UserProfile";
import UserAppointments from "../components/user/UserAppointments";
import DummyContent from "../containers/DummyContent";
import "../styles/Navbar.css";

const UserDashboard = () => {
  const history = useHistory();
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const { path, url } = useRouteMatch();

  const [user, setUser] = useState({});

  const base = "page-content pt-3 ";
  const classNameHtml = !sidebarToggled ? base + " active" : base; // kad sidebar i content ima klasu active onda je sidebar sakriven i content full screen sa gumbom

  const handleClick = () => {
    setSidebarToggled(!sidebarToggled);
  };

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  return (
    <>
      {/* <Container fluid> */}
      <Sidebar
        isToggled={sidebarToggled}
        closeSidebarOnClick={handleClick}
        loggedUser={user}
      />
      <Container
        fluid
        className="pt-5 "
        style={{ paddingRight: "5px", paddingLeft: "10px" }}
      >
        <div className={classNameHtml} id="content">
          {/*  <!-- Toggle button --> */}
          <button
            id="sidebarCollapse"
            type="button"
            className="btn btn-light bg-white d-md-none shadow-sm px-2  py-4 position-fixed fixed-left toggle-button"
            onClick={handleClick}
          >
            {!sidebarToggled ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
          </button>

          <Switch>
            <Route exact path={`${path}/salons`} component={SalonFeed} />
            <Route
              exact
              path={`${path}/appointments`}
              component={UserAppointments}
            />
            <Route exact path={`${path}/profile`} component={UserProfile} />
            <Route path={path} component={DummyContent} />
          </Switch>
        </div>
      </Container>
      {/* </Container> */}
    </>
  );
};
/*
  
*/

export default UserDashboard;
