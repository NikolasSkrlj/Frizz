import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Link, withRouter, useHistory } from "react-router-dom";

const SalonDashboard = () => {
  const history = useHistory();
  const { userType } = useContext(GlobalContext);

  useEffect(() => {
    if (!userType || userType === "user") {
      console.log("You're not allowed to be here");
      history.push("/");
    }
  });
  return (
    <div>
      {" "}
      Ovdje ce biti admin interface za salon
      <button onClick={() => console.log("s")}>yasa</button>
    </div>
  );
};

export default SalonDashboard;
