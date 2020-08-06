import React from "react";
import GlobalContextProvider from "./contexts/GlobalContext";
import SalonContextProvider from "./contexts/SalonContext";
import Salon from "../src/components/user/Salon";
import Navbar from "../src/components/user/Navbar";
import LandingPage from "../src/containers/LandingPage";
import UserDashboard from "../src/containers/LandingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
/**
 <Navbar />
      <header className="App-header">Hello fuckers</header>
      <SalonContextProvider>
        <Salon />
      </SalonContextProvider>
 */
function App() {
  return (
    <BrowserRouter>
      <GlobalContextProvider>
        <LandingPage>
          <Switch>
            <Route exact path="/user" component={UserDashboard}></Route>
          </Switch>
        </LandingPage>
      </GlobalContextProvider>
    </BrowserRouter>
  );
}

export default App;
