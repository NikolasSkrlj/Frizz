import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../contexts/GlobalContext";
import axios from "axios";
import { Card, Spinner, Button } from "react-bootstrap";
import Salon from "./Salon";
import { FiSliders } from "react-icons/fi";

const SalonFeed = () => {
  const { authToken } = useContext(GlobalContext);
  const [filtersToggle, setFiltersToggle] = useState(false); // ovo ce biti za filtriranje podataka dal se vidi card
  //const [filters, setFilters] = useState({}); // ovdje ce se nalaziti filteri(objekt sa match, sort, project i tim propertyma)
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("http://localhost:4000/user/salons", {
        headers: {
          Authorization: authToken,
        },
      });
      console.log(res.data);
      setSalons(res.data.salons);
    };
    getData();
  }, []);

  const handleFilterClick = () => {
    setFiltersToggle(!filtersToggle);
  };

  const mappedSalons = salons.map((salon) => {
    return <Salon salonData={salon} key={salon.id} />;
  });

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
      {salons.length ? (
        mappedSalons
      ) : (
        <div className="text-center text-muted justify-content-center">
          <h6 className="pb-2">...Učitavanje salona...</h6>
          <Spinner animation="border" variant="info" />
        </div>
      )}
    </Card>
  );
};

export default SalonFeed;
