import React from "react";
import { Nav, Button, Navbar, Container, Row, Col } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = ({ isToggled }) => {
  const base = "vertical-nav bg-white";
  const classNameHtml = !isToggled ? base + " active" : base; // kad ima klasu active onda je sidebar sakriven ??

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
            <h4 className="m-0">Nikolas Škrlj </h4>
            <p className="font-weight-light text-muted mb-0">Absolute madman</p>
          </div>
        </div>
      </div>

      <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">
        Menu
      </p>

      <ul className="nav flex-column bg-white mb-0">
        <li className="nav-item">
          <a href="#" className="nav-link text-dark font-italic bg-light">
            <i className="fa fa-th-large mr-3 text-primary fa-fw"></i>
            Naslovnica
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark font-italic">
            <i className="fa fa-address-card mr-3 text-primary fa-fw"></i>
            Saloni
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark font-italic">
            <i className="fa fa-cubes mr-3 text-primary fa-fw"></i>
            Profil
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-dark font-italic">
            <i className="fa fa-picture-o mr-3 text-primary fa-fw"></i>
            Postavke
          </a>
        </li>
      </ul>
    </div>
  );
};
/*


*/

export default withRouter(Sidebar);
