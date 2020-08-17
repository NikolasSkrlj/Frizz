import React, { Component, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import { SalonContext } from "../../contexts/SalonContext";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";

const Salon = () => {
  /*  const isLoggedIn = useContext(GlobalContext);
  const { salon, updateSalon } = useContext(SalonContext);
 */
  /* useEffect(() => {
    const getRes = async () => {
      const res = await axios.get("http://localhost:4000/hairsalon/get", {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJiZWMzMWViYmZlMjFjMzBjZjNlYTgiLCJpYXQiOjE1OTY3MTQwMzR9.EwX-ktuYEYDQVI_QyK1l2Ha1_Ki2_cVpuFN0FTB0JNU",
        },
      });
      console.log(res.data.salon);
      updateSalon(res.data.salon);
    };
    getRes();
  }, []); */

  return <div className="pt-5 text-white lead">Wuhuu rendera se salon</div>;
};

export default Salon;
