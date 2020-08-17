import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

const ProtectedRoute = (props) => {
  const Component = props.component;
  const { isLoggedIn, authToken, userType } = useContext(GlobalContext);
  const check = isLoggedIn && authToken && userType === props.forUser;
  return check ? <Component /> : <Redirect to={{ pathname: "/" }} />;
};

export default ProtectedRoute;
