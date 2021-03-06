//ovdje moze biti provjera ako je korisnik authan
import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

const GlobalContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("loggedIn")
  ); //bool za provjeru
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token")); //token koji se dobije nakon prijave
  const [showLoginModal, setShowLoginModal] = useState(false); // togglanje vidljivosti modala
  const [user, setUser] = useState({}); // podaci o useru
  const [salon, setSalon] = useState({}); // podaci o salonu (ili jedno ili drugo)
  const [userType, setUserType] = useState(sessionStorage.getItem("userType")); // moze biti user ili salon

  const toggleShowLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };
  const toggleIsLoggedIn = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <GlobalContext.Provider
      value={{
        showLoginModal,
        toggleShowLoginModal,
        isLoggedIn,
        setUser,
        setAuthToken,
        authToken,
        user,
        toggleIsLoggedIn,
        salon,
        setSalon,
        userType,
        setUserType,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

//Kad bude export default to je komponenta a kad export const neka varijabla onda gdje importamo
// moramo destrukturirat da dobijemo tu varijablu
