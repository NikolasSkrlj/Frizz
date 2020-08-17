import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { Link, withRouter, useHistory } from "react-router-dom";

const SalonDashboard = () => {
  const history = useHistory();
  const { userType } = useContext(GlobalContext);

  return <div> Ovdje ce biti admin interface za salon</div>;
};

export default SalonDashboard;
