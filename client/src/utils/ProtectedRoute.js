import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

const ProtectedRoute = (props) => {
  const { isLoggedIn, authToken, userType } = useContext(GlobalContext);
  const check = isLoggedIn && authToken && userType === props.forUser;
  return check ? (
    <Route path={props.path} component={props.component} />
  ) : (
    <Redirect to={{ pathname: "/" }} />
  );
};

export default ProtectedRoute;
