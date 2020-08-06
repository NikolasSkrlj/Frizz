//ovdje moze biti provjera ako je korisnik authan
import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

const GlobalContextProvider = (props) => {
  const [dummyAuth, setDummyAuth] = useState({ isAuth: true });
  return (
    <GlobalContext.Provider value={{ dummyAuth }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

//Kad bude export default to je komponenta a kad export const neka varijabla onda gdje importamo
// moramo destrukturirat da dobijemo tu varijablu
