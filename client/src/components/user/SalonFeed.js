import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";

import axios from "axios";
import { Card, Spinner, Button, Alert } from "react-bootstrap";
import Salon from "./Salon";
import { FiSliders } from "react-icons/fi";

const SalonFeed = () => {
  const { authToken } = useContext(GlobalContext);
  const [filtersToggle, setFiltersToggle] = useState(false); // ovo ce biti za filtriranje podataka dal se vidi card
  //const [filters, setFilters] = useState({}); // ovdje ce se nalaziti filteri(objekt sa match, sort, project i tim propertyma)
  const [salons, setSalons] = useState([]);

  //za error handling i loading indikator
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // da se ne pojavi error odmah mali bug

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const res = await axios.get("/user/salons", {
          // ovo mozemo jer smo stavili proxy u package.json
          headers: {
            Authorization: authToken,
          },
        });

        setSalons(res.data.salons);
        setIsLoading(false);
      } catch (err) {
        if (err.response) {
          setFetchSuccess(false);
          setIsLoading(false);
        }
      }
    };
    getData();
  }, []);

  useEffect(() => {
    setFetchSuccess(true);
  }, [salons]);

  const handleFilterClick = () => {
    setFiltersToggle(!filtersToggle);
  };

  return (
    <Card body>
      <Card className="mb-4">
        <Card.Header className=" d-flex justify-content-end">
          <Button variant="outline-info" onClick={handleFilterClick}>
            Filter <FiSliders className="ml-2" />
          </Button>
        </Card.Header>

        {filtersToggle ? <Card.Body>Ovdje ce biti filteri</Card.Body> : <div />}
      </Card>
      {isLoading ? (
        <div className="text-center text-muted justify-content-center">
          <h6 className="pb-2">...Učitavanje salona...</h6>
          <Spinner animation="border" variant="info" />
        </div>
      ) : fetchSuccess ? (
        salons.length ? (
          salons.map((salon) => {
            return <Salon salonData={salon} key={salon.id} />;
          })
        ) : (
          <h6 className="text-muted">Nema salona</h6>
        )
      ) : (
        <Alert variant="danger">
          <Alert.Heading>Došlo je do pogreške!</Alert.Heading>
          <p>Molimo osvježite stranicu!</p>
        </Alert>
      )}
    </Card>
  );
};

export default SalonFeed;
