import React, { useState } from "react";
import GlobalContextProvider from "./contexts/GlobalContext";
//import SalonContextProvider from "./contexts/SalonContext";
import Salon from "../src/components/user/Salon";
import NavbarContainer from "./containers/Navbar";
import LandingPage from "../src/containers/LandingPage";
import UserDashboard from "../src/containers/UserDashboard";
import SalonDashboard from "../src/containers/SalonDashboard";
//import LoginModal from "./containers/LoginModal";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <GlobalContextProvider>
      <NavbarContainer />
      <Switch>
        <Route exact path="/" component={LandingPage}></Route>
        <ProtectedRoute
          forUser="salon"
          path="/hairsalon"
          component={SalonDashboard}
        />
        <ProtectedRoute forUser="user" path="/user" component={UserDashboard} />

        {/*  <Route path="/user" component={UserDashboard}></Route>
        <Route path="/hairsalon" component={SalonDashboard}></Route> */}
        <Route
          path="/"
          render={() => {
            return <div>404 - Stranica koju ste tražili nije pronađena </div>;
          }}
        ></Route>
      </Switch>
    </GlobalContextProvider>
  );
}

export default App;
