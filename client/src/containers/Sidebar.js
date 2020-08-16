import React from "react";
import { Nav, Button, Navbar, Container, Row, Col } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = ({ isToggled }) => {
  const base = "vertical-nav bg-white";
  // const classHtml = isToggled ? base + " active" : base;
  //ovdje moze doc podaci o prijavljenom korisniku/salonu uz avatar
  return (
    <div class={base} id="sidebar">
      <div class="py-4 px-3 mb-4 bg-light">
        <div class="media d-flex align-items-center">
          <img
            src="https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png"
            alt="..."
            width="65"
            class="mr-3 rounded-circle img-thumbnail shadow-sm"
          />
          <div class="media-body">
            <h4 class="m-0">Nikolas Škrlj </h4>
            <p class="font-weight-light text-muted mb-0">Absolute madman</p>
          </div>
        </div>
      </div>

      <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">
        Menu
      </p>

      <ul class="nav flex-column bg-white mb-0">
        <li class="nav-item">
          <a href="#" class="nav-link text-dark font-italic bg-light">
            <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>
            Naslovnica
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-dark font-italic">
            <i class="fa fa-address-card mr-3 text-primary fa-fw"></i>
            Saloni
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-dark font-italic">
            <i class="fa fa-cubes mr-3 text-primary fa-fw"></i>
            Profil
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link text-dark font-italic">
            <i class="fa fa-picture-o mr-3 text-primary fa-fw"></i>
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
