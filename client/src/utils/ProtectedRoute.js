import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

const ProtectedRoute = (props) => {
  const {
    isLoggedIn,
    authToken,
    userType,
    toggleIsLoggedIn,
    setAuthToken,
    setUserType,
  } = useContext(GlobalContext);
  const check = isLoggedIn && authToken && userType === props.forUser;

  const resetLoginValues = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("salon");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userType");
    toggleIsLoggedIn();
    setAuthToken("");
    setUserType("");
  };
  return check ? (
    <Route path={props.path} component={props.component} />
  ) : (
    <>
      <Redirect to={{ pathname: "/" }} /> {resetLoginValues()}
    </>
  );
};

export default ProtectedRoute;
