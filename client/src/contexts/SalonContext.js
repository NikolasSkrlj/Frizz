//ovdje moze biti provjera ako je korisnik authan
import React, { createContext, useState } from "react";

export const SalonContext = createContext();

const SalonContextProvider = (props) => {
  const [salon, setSalon] = useState({});

  const updateSalon = (salon) => {
    setSalon(salon);
  };
  return (
    <SalonContext.Provider value={{ salon, updateSalon }}>
      {props.children}
    </SalonContext.Provider>
  );
};

export default SalonContextProvider;
