import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Link, withRouter, useHistory } from "react-router-dom";

const UserDashboard = () => {
  const history = useHistory();
  const { userType } = useContext(GlobalContext);

  useEffect(() => {
    if (!userType || userType === "hairsalon") {
      console.log("You're not allowed to be here");
      history.push("/");
    }
  });
  return <div> Ovdje ce biti feed za usera</div>;
};

export default UserDashboard;
