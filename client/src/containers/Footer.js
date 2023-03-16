import React from "react";
import { Container } from "react-bootstrap";
const Footer = (params) => {
  return (
    <Container
      fluid
      className="bg-light text-center pb-3"
      style={{ marginBottom: 0 }}
    >
      <Container>
        <p className="font-weight-light pt-3 pb-2">
          {" "}
          Copyright &copy; 2020 Nikolas Škrlj
        </p>
        <small className="text-muted pb-3">
          {/* zbog icona treba dati im credit, to ce bit u footeru.
           */}
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          ,{" "}
          <a
            href="https://www.flaticon.com/authors/photo3idea-studio"
            title="photo3idea_studio"
          >
            photo3idea_studio
          </a>
          , and{" "}
          <a href="https://icon54.com/" title="Pixel perfect">
            Pixel perfect
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
          <a href="https://www.freepik.com/photos/hair">
            Hair photo created by freepik - www.freepik.com
          </a>
        </small>
      </Container>
    </Container>
  );
};

export default Footer;
