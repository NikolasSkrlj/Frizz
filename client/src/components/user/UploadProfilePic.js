import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import { Spinner, Button, Alert, Form, Row, Col } from "react-bootstrap";

const UploadProfilePic = () => {
  const { authToken, user, setUser } = useContext(GlobalContext);
  const [profilePic, setProfilePic] = useState();

  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const params = useParams();

  const handleFileSelect = (e) => {
    setProfilePic(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      setSubmitSuccess(false);
      setMessage("Odaberite datoteku!");
      setMessageToggled(true);
      return;
    }

    const formData = new FormData();

    // Update the formData object
    formData.append("profilePic", profilePic, profilePic.name);

    setMessageToggled(false);
    setMessage("");
    try {
      const res = await axios.post(`/user/${params.id}/upload_pic`, formData, {
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        setSubmitSuccess(true);
        setMessage(res.data.message);
        //setUser(res.data.user);

        setMessageToggled(true);

        setTimeout(() => {
          setMessageToggled(false);
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      //ovdje treba provjera ako je kod specifican vratit poruku da user postoji
      console.log(err.error, err.response);
      if (err.response) {
        setSubmitSuccess(false);
        setMessage(
          "Došlo je do pogreške! Provjerite da je datoteka ispravnog formata(.jpg, .jpeg, .png) i dozvoljene veličine(5 Mb)"
        );
        setMessageToggled(true);
      }
    }
  };

  return (
    <Row className={`${window.innerWidth <= 765 && "mt-3"}`}>
      <Form onSubmit={handleSubmit} className="text-left w-100">
        <Col md={{ span: 12 }}>
          <div className="my-2">
            <Form.File
              id="custom-file"
              label={
                (profilePic && profilePic.name) ||
                "Ime datoteke (max veličina - 5 MB)"
              }
              name="profilePic"
              custom
              data-browse="Odaberi"
              onChange={handleFileSelect}
            />
          </div>
          <Alert
            variant={submitSuccess ? "success" : "danger"}
            show={messageToggled}
          >
            {message}
          </Alert>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="info" className="w-100">
              Prenesi datoteku
            </Button>
          </div>
        </Col>
      </Form>
    </Row>
  );
};

export default UploadProfilePic;
