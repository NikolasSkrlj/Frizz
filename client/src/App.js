import React, { useState } from "react";
import GlobalContextProvider from "./contexts/GlobalContext";
import SalonContextProvider from "./contexts/SalonContext";
import Salon from "../src/components/user/Salon";
import NavbarContainer from "./containers/Navbar";
import LandingPage from "../src/containers/LandingPage";
import UserDashboard from "../src/containers/LandingPage";
import LoginModal from "./containers/LoginModal";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
/**
 <Navbar />
      <header className="App-header">Hello fuckers</header>
      <SalonContextProvider>
        <Salon />
      </SalonContextProvider>
 */
function App() {
  const [showModal, setShowModal] = useState(false);
  const toggleShow = () => {
    setShowModal(!showModal);
  };
  return (
    <Router>
      <GlobalContextProvider>
        <NavbarContainer />
        <LoginModal />
        <Switch>
          <Route exact path="/" component={LandingPage}></Route>
          <Route path="/register_user" component={UserDashboard}></Route>
          <Route path="/login_user" component={UserDashboard}></Route>
          <Route
            path="/login"
            render={() => {
              return <div>Loguj se</div>;
            }}
          ></Route>
          <Route path="/register_salon" component={UserDashboard}></Route>
          <Route path="/login_salon" component={UserDashboard}></Route>
          <Route
            path="/"
            render={() => {
              return <div>404 - Stranica koju ste tražili nije pronađena</div>;
            }}
          ></Route>
        </Switch>
      </GlobalContextProvider>
    </Router>
  );
}

export default App;
