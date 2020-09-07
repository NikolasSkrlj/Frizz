import React, { useState, useEffect, useContext } from "react";
import { FaNewspaper, FaRegUser, FaCalendarDay } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";

import { GlobalContext } from "../contexts/GlobalContext";

import {
  Link,
  withRouter,
  useHistory,
  useRouteMatch,
  useParams,
  Route,
  Switch,
} from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = ({ isToggled, closeSidebarOnClick, user, salon }) => {
  const base = "vertical-nav bg-white";
  const classNameHtml = !isToggled ? base + " active" : base; // kad ima klasu active onda je sidebar sakriven ??
  const { userType } = useContext(GlobalContext);
  /* const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [salon, setSalon] = useState(
    JSON.parse(sessionStorage.getItem("salon"))
  ); */

  // const history = useHistory();
  const { path, url } = useRouteMatch();
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` letss
  // us build relative links.

  //kada na mobilnoj verziji kliknemo nesto automatski se zatvori sidebar
  const handleLinkClick = () => {
    if (window.innerWidth <= 765) {
      closeSidebarOnClick();
    }
  };

  //ovdje moze doc podaci o prijavljenom korisniku/salonu uz avatar
  return (
    <div className={classNameHtml} id="sidebar">
      <div className="py-4 px-3 mb-4 bg-light">
        <div className="media d-flex align-items-center">
          <img
            src="https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
            alt="..."
            width="65"
            className="mr-3 rounded-circle img-thumbnail shadow-sm"
          />
          <div className="media-body">
            <h4 className="m-0">
              {userType === "user" ? user && user.name : salon && salon.name}
            </h4>
            <p className="font-weight-light text-muted mb-0">
              {userType === "user" ? "korisnik" : "admin salona"}
            </p>{" "}
          </div>
        </div>
      </div>

      <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">
        Menu
      </p>
      {user && userType === "user" ? (
        <ul className="nav flex-column bg-white mb-0">
          {/* <li className="nav-item">
         <Link
           onClick={handleLinkClick}
           className="nav-link text-dark text-bold bg-light"
           to={`${url}`}
         >
           <FaNewspaper className="mr-3" />
           Naslovnica
         </Link>
       </li> */}
          <li className="nav-item">
            <Link
              className="nav-link text-dark  bg-light"
              to={`${url}/saloni`}
              onClick={handleLinkClick}
            >
              <FiScissors className="mr-3" />
              Saloni
            </Link>
          </li>
          <li className="nav-item">
            <Link
              onClick={handleLinkClick}
              className="nav-link text-dark text-bold bg-light"
              to={`${url}/appointments`}
            >
              <FaCalendarDay className="mr-3" />
              Termini
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-dark text-bold bg-light"
              onClick={handleLinkClick}
              to={`${url}/${user._id}/profile`}
            >
              <FaRegUser className="mr-3" />
              Profil
            </Link>
          </li>
        </ul>
      ) : (
        salon && (
          <ul className="nav flex-column bg-white mb-0">
            {/* <li className="nav-item">
        <Link
          onClick={handleLinkClick}
          className="nav-link text-dark text-bold bg-light"
          to={`${url}`}
        >
          <FaNewspaper className="mr-3" />
          Naslovnica
        </Link>
      </li> */}

            <li className="nav-item">
              <Link
                onClick={handleLinkClick}
                className="nav-link text-dark text-bold bg-light"
                to={`${url}/appointments`}
              >
                <FaCalendarDay className="mr-3" />
                Termini
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark text-bold bg-light"
                onClick={handleLinkClick}
                to={`${url}/${salon._id}/profile`}
              >
                <FaRegUser className="mr-3" />
                Profil
              </Link>
            </li>
          </ul>
        )
      )}
    </div>
  );
};
/*


*/

export default withRouter(Sidebar);
