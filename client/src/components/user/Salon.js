import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useDebugValue,
} from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr";
import StarRatings from "react-star-ratings";
import axios from "axios";
import {
  isWithinInterval,
  addMinutes,
  areIntervalsOverlapping,
} from "date-fns";

import {
  Card,
  Nav,
  Button,
  ListGroup,
  Tab,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Badge,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { isEmpty, toIsoString } from "../../utils/helperFunctions"; // za provjeru ako je objekt prazan
import SalonReviews from "./SalonReviews";

const Salon = ({ salonData }) => {
  //const { authToken, user } = useContext(GlobalContext);
  const authToken = sessionStorage.getItem("token");
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const {
    id,
    name,
    email,
    address,
    gallery,
    workingHours,
    appointmentTypes,
    hairdressers,
    phone,
    reviews,
    globalRating,
  } = salonData;

  //ovo bi trebalo grupirat u razumljiviji state al zasad ne diramo
  //za datepicker
  const [appointmentDate, setAppointmentDate] = useState(new Date()); // datum termina
  const [appointmentTime, setAppointmentTime] = useState(new Date()); // vrijeme termina -> kombinira se sa ovim iznad

  // kontrola rezerviranosti
  const [dateChecked, setDateChecked] = useState(false); //sluzi za validaciju ispravnog redoslijeda
  const [timeChecked, setTimeChecked] = useState(false); //sluzi za validaciju ispravnog redoslijeda
  const [takenTimes, setTakenTimes] = useState([]); // rezervirani termini na datum koji je odabran
  const [appointmentsLoading, setAppointmentsLoading] = useState(false); // rezervirani termini na datum koji je odabran

  //za odabir termina
  const [appointmentTypeSelect, setAppointmentTypeSelect] = useState("Odaberi"); // label dropdowna
  const [appointmentType, setAppointmentType] = useState({}); //vrsta termina
  const [appointmentValid, setAppointmentValid] = useState(false); // provjera s kojom omogucujemo potvrdu termina button

  //frizeri koji se mogu odabrati ovisno o odabranom vremenu danu i vremenu
  const [allHairdressers, setAllHairdressers] = useState(hairdressers); //svi u salonu
  const [workingHairdressers, setWorkingHairdressers] = useState(hairdressers); //kontrolirani odabirom vremena, ovisno koja smjena
  const [hairdressersSelect, setHairdressersSelect] = useState("Neodređen/a"); // label dropdowna
  const [hairdresser, setHairdresser] = useState({}); //odabrani frizer

  //kontrola dal je user vec rezervirao termin na taj datum, zastita neka od "napada" lmao
  const [userDateCheck, setUserDateCheck] = useState(false);

  //za prikaz errora u slucaju zauzetog termina ili uspjeha
  const [message, setMessage] = useState("");
  const [messageToggled, setMessageToggled] = useState(false);
  const [messageVariant, setMessageVariant] = useState("danger");

  const firstRender = useRef(true);

  // za kalendar da je na hrvatskom
  registerLocale("hr", hr);

  // provjeravamo dali vrijeme termina za taj datum se preklapa s nekim postojecim terminom
  const checkAppointment = () => {
    //console.log("Funkcija checkAppointment se izvrsava");
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setMessageVariant("danger");

    //provjera da je odabran radni dan
    const dayInWeek =
      appointmentDate.getDay() === 0 ? 7 : appointmentDate.getDay(); // ovo ovako jer getDate daje 0 index za nedjelju a meni u bazi je 7
    const day = workingHours.find((wh) => wh.index === dayInWeek);

    if (!day.startWorktime) {
      setMessage("Odabran je neradni dan salona, molimo odaberite ponovno!");
      setMessageToggled(true);
      return false;
    }

    //ovo mora biti na vrhu jer ako je na dnu i dodje do errora returna se false pa ne dodje do te naredbe
    filterHairdressers();

    //kontrola da se prije odabira vremena mora odabrat vrsta termina, a prije toga bi trebao datum al nije nuzno
    if (appointmentTypeSelect === "Odaberi" && timeChecked) {
      setMessage("Odaberite vrstu termina!");
      setMessageToggled(true);
      return false;
    } else {
      setMessage("");
      setMessageToggled(false);
    }
    //provjera ako je vrijeme termina u okviru radnog vremena
    const timestamp =
      appointmentTime.getHours() + appointmentTime.getMinutes() / 60;

    if (!(timestamp >= day.startWorktime && timestamp < day.endWorktime)) {
      setMessage("Odaberite vrijeme termina u radnom vremenu salonu!");
      setMessageToggled(true);
      return false;
    }

    //pocetak i kraj odabranog termina u minutama
    const appointmentDateTimeStart = new Date(appointmentDate);
    appointmentDateTimeStart.setHours(
      appointmentTime.getHours(),
      appointmentTime.getMinutes()
    );
    const appointmentDateTimeEnd = addMinutes(
      appointmentDateTimeStart,
      appointmentType.duration ? appointmentType.duration : 0
    );

    //odvajamo logiku provjere ovisno je li odabran frizer ili ne
    if (isEmpty(hairdresser)) {
      //samo za potrebe inicijalnog stanja kad imamo dummy vrijednosti
      if (appointmentDateTimeStart > appointmentDateTimeEnd) return;

      //prolazak kroz termine za odabrani datum i provjera ako se preklapa s nekim i vraca prikladan boolean
      for (const appointment of takenTimes) {
        if (!appointment.hairdresserId) {
          const start = new Date(appointment.appointmentDate).setHours(
            appointment.startTime.hours,
            appointment.startTime.minutes,
            0
          );
          const end = new Date(appointment.appointmentDate).setHours(
            appointment.endTime.hours,
            appointment.endTime.minutes,
            0
          );

          //ako se preklapaju intervali odabranih termina i onih u bazi, cak i jedna minuta, ne dopusta se rezervacija
          if (
            areIntervalsOverlapping(
              {
                start: appointmentDateTimeStart,
                end: appointmentDateTimeEnd,
              },
              {
                start,
                end,
              }
            ) &&
            timeChecked
          ) {
            setMessage(
              "Vrijeme termina kojeg ste odabrali je zauzeto ili se preklapa s postojećim, molimo provjerite tablicu popunjenih termina i odaberite ponovno."
            );
            setMessageToggled(true);
            return false;
          }
        }
      }
      //ako postoji hairdresser provjeravamo ako je za odabran termin on slobodan ili ne, tj ako se preklapaju termini
    } else {
      for (const appointment of takenTimes) {
        //console.log(hairdresser.id, appointment.hairdresserId.id);
        //ovdje je hairdresserId instanca modela jer smo populirali taj objectId pri pozivu
        if (
          appointment.hairdresserId &&
          hairdresser.id === appointment.hairdresserId.id
        ) {
          const start = new Date(appointment.appointmentDate).setHours(
            appointment.startTime.hours,
            appointment.startTime.minutes,
            0
          );
          const end = new Date(appointment.appointmentDate).setHours(
            appointment.endTime.hours,
            appointment.endTime.minutes,
            0
          );

          //ako se preklapaju intervali odabranih termina i onih u bazi, cak i jedna minuta, ne dopusta se rezervacija
          if (
            areIntervalsOverlapping(
              {
                start: appointmentDateTimeStart,
                end: appointmentDateTimeEnd,
              },
              {
                start,
                end,
              }
            ) &&
            timeChecked
          ) {
            setMessage(
              "Frizer kojeg ste odabrali nije slobodan u odabranom vremenu termina. Molimo izaberite drugo vrijeme ili postavite izbornik frizera kao 'Neodređen/a'."
            );
            setMessageToggled(true);
            return false;
          }
        }
      }
    }
    setMessage("");
    setMessageToggled(false);

    if (appointmentTypeSelect !== "Odaberi" && timeChecked && dateChecked) {
      return true;
    }
  };

  // filtriramo odabir frizera tako da s obzirom na odabereno vrijeme termina omogucimo odabir samo onih frizera koji rade u toj smjeni
  const filterHairdressers = () => {
    // ovo ovako jer getDate daje 0 index za nedjelju a meni u bazi je 7
    const dayInWeek =
      appointmentDate.getDay() === 0 ? 7 : appointmentDate.getDay();
    const timestamp =
      appointmentTime.getHours() + appointmentTime.getMinutes() / 60;
    /*  const day = workingHours.find((wh) => wh.index === dayInWeek);

    if (!day.startWorktime) {
      setMessage("Odabran je neradni dan salona, molimo odaberite ponovno!");
      setMessageToggled(true);
      setAppointmentValid(false);
      return;
    } */

    const filtered = allHairdressers.filter((hairdresser) => {
      const day = hairdresser.workDays.find((wd) => wd.index === dayInWeek); // pronalazak dana u tjednu i radno vrijeme frizera u tom danu
      return timestamp >= day.startTime && timestamp < day.endTime;
    });
    setWorkingHairdressers(filtered);
  };

  const handleDateChange = async (date) => {
    try {
      setDateChecked(true);
      setAppointmentDate(new Date(date.setHours(18, 0, 0)));
      //stavljamo fiksno vrijeme zbog nacina na koji mongoose pretrazuje datume
      // vrijeme cemo spremati u druge varijable jer nam treba logika validacije za odabir vremena i datuma odvojeno
      //vraca salon i termine koji ima tog datuma
      setAppointmentsLoading(true);
      const res = await axios.post(
        `/user/${id}/check_date`,
        {
          appointmentDate: date.toISOString(),
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      // console.log(res.data.appointments);
      setTakenTimes(res.data.appointments);

      setUserDateCheck(res.data.userCheck);
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      }
    }
  };

  const handleTimeChange = (time) => {
    setAppointmentTime(time);
    //  console.log(`Vrijeme odabrano: ${time.getHours()}:${time.getMinutes()}`);
    setHairdresser({});
    setHairdressersSelect("Neodređen/a");
    setTimeChecked(true);

    //  checkAppointment(appointmentDate, appointmentTime, appointmentType, takenTimes);
  };

  const handleTypeSelect = (appType) => {
    setAppointmentType(appType);
    setAppointmentTypeSelect(appType.name);
  };

  const handleHairdresserSelect = (hairdresser) => {
    setHairdresser(hairdresser);
    //ako je odaberen neodređen/a stavljamo frizera {} i ime takvo
    if (hairdresser.name) {
      setHairdressersSelect(hairdresser.name);
    } else {
      setHairdressersSelect("Neodređen/a");
    }
    // e.target.getAttribute("apptypid")); // ovako se dohvaca custom props koje zadajemo DOM nodeovima
  };

  const handleSubmit = async () => {
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(
      appointmentTime.getHours(),
      appointmentTime.getMinutes()
    );
    const end = addMinutes(
      appointmentDateTime,
      appointmentType.duration ? appointmentType.duration : 0
    );

    try {
      const res = await axios.post(
        `/user/${id}/create_appointment`,
        {
          //sve podatke vadimo iz statea
          appointmentDate: appointmentDateTime,

          hairdresserId: isEmpty(hairdresser) ? null : hairdresser.id,

          startTime: {
            hours: appointmentDateTime.getHours(),
            minutes: appointmentDateTime.getMinutes(),
          },
          endTime: {
            hours: end.getHours(),
            minutes: end.getMinutes(),
          },
          appointmentType: appointmentType.id,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      if (res.data.success) {
        setMessageVariant("success");
        setAppointmentValid(false);
        setMessage("Rezervacija uspješno spremljena!");
        setMessageToggled(true);
        //treba se sad redirectat negdje ili nesto
      }
    } catch (err) {
      if (err.response) {
        console.warn("Potvrda nije uspjela", err.response);
        setMessageVariant("danger");
        setMessage(
          "Došlo je do pogreške pri spremanju rezervacije, pokušajte ponovno!"
        );
        setMessageToggled(true);
      }
    }
  };

  //Ovim useEffectovima kontroliramo dinamicku pojavu errora kod odabira svakog od stavki, vise use caseva
  // ovime kontroliramo da se prije postavi time u state a tek onda provjerava dostupnost, inace se ne izvsri kako treba
  useEffect(() => {
    // ovisno o uspjesnosti provjere, omogucava se button za potvrdu termina
    const valid = checkAppointment();
    setAppointmentValid(valid);
  }, [appointmentTime, appointmentDate, appointmentType, hairdresser]);

  useEffect(() => {
    setAppointmentsLoading(false);
  }, [takenTimes]);

  useEffect(() => {
    if (userDateCheck) {
      setMessageVariant("danger");
      setMessageToggled(true);
      setMessage(
        "Već postoji rezervacija na odabrani datum registrirana na Vaše ime!"
      );
      setAppointmentValid(false);
    }
  }, [
    userDateCheck,
    appointmentDate,
    appointmentTime,
    appointmentType,
    hairdresser,
  ]);

  // pomocne komponente za stiliziranje date/time inputa -> iz dokumentacije
  const DateInput = ({ onClick }) => {
    return (
      <div>
        <Button disabled variant="light" style={{ pointerEvents: "none" }}>
          {dateChecked
            ? new Date(appointmentDate).toLocaleDateString()
            : "Odaberite datum"}
        </Button>

        <Button variant="outline-info" onClick={onClick}>
          <FaCalendarAlt />
        </Button>
      </div>
    );
  };
  const TimeInput = ({ onClick }) => {
    return (
      <div>
        <Button disabled variant="light" style={{ pointerEvents: "none" }}>
          {timeChecked
            ? new Date(appointmentTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Odaberite vrijeme"}
        </Button>
        <Button variant="outline-info" onClick={onClick}>
          <FaClock />
        </Button>
      </div>
    );
  };

  // pomocna funkcija za mapiranje radnog vremena frizera jer drukcije je tesko zbog strukture podataka
  const hairdressersWorkHours = () => {
    const mapped = [];
    const days = [
      "ponedjeljak",
      "utorak",
      "srijeda",
      "četvrtak",
      "petak",
      "subota",
      "nedjelja",
    ];

    for (let i = 0; i < 7; i++) {
      const row = [];
      row.push(<td>{days[i]}</td>);
      for (let j = 0; j < hairdressers.length; j++) {
        row.push(
          <td>
            {hairdressers[j].workDays[i].startTime
              ? hairdressers[j].workDays[i].startTime +
                "-" +
                hairdressers[j].workDays[i].endTime
              : "ne radi"}
          </td>
        );
      }
      mapped.push(<tr>{row}</tr>);
    }

    return mapped;
  };
  return (
    <Card className="mb-3">
      <Tab.Container id="left-tabs-example" defaultActiveKey="about">
        <Card.Header className="bg-info text-white">
          <div className="lead">{name}</div>
          <div>
            <span>
              <StarRatings
                starDimension="18px"
                starSpacing="3px"
                rating={globalRating}
                starRatedColor="yellow"
                numberOfStars={5}
                name="Ocjena"
              />
            </span>
            <small className="align-middle ml-1">
              {reviews.length ? `(${reviews.length} ocjena)` : "(nema ocjena)"}
            </small>
          </div>
        </Card.Header>
        <Card.Header>
          <Nav variant="tabs" fill>
            <Nav.Item>
              <Nav.Link className="text-info " eventKey="about">
                O salonu
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="wh">
                Radno vrijeme
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="reserve">
                Rezerviraj termin
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-info" eventKey="reviews">
                Recenzije
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Tab.Content>
          <Tab.Pane eventKey="about">
            <Card.Body id="about">
              <Card.Text>
                {name} je frizerski salon smješten u centru Buzeta gdje već
                nekoliko godina uspješno posluje i stoji građanima na
                raspolaganju.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4>Adresa</h4>
                  {Object.values(address).join(", ")}{" "}
                  <a href="#">vidi na karti</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>E-mail</h4>
                  {email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>Telefon</h4>
                  {phone}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="wh">
            <Card.Body id="wh" className="text-center">
              <Row>
                <Col sm={4}>
                  <h4>Salon</h4>
                  <Table striped size="sm" variant="light">
                    <thead>
                      <tr>
                        <th>Dan</th>
                        <th>Radno vrijeme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workingHours.map((day) => {
                        return (
                          <tr key={day.id}>
                            <td>{day.dayName}</td>
                            <td>
                              {day.startWorktime
                                ? `${day.startWorktime}-${day.endWorktime}`
                                : "ne radi se"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>

                <Col sm={8}>
                  <h4>Frizeri</h4>
                  <Table striped size="sm" variant="light">
                    <thead>
                      <tr>
                        <th>Dan</th>
                        <th colSpan={hairdressers.length}>Radno vrijeme</th>
                      </tr>
                      <tr>
                        <th></th>
                        {hairdressers.length &&
                          hairdressers.map((item) => <th>{item.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>{hairdressersWorkHours()}</tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>{" "}
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
            <Card.Body>
              <SalonReviews salon={salonData} />
            </Card.Body>
          </Tab.Pane>
          <Tab.Pane eventKey="reserve">
            <Card.Body>
              <Row>
                <Col sm={dateChecked ? 4 : 12} className="mb-3">
                  <h5 className="mb-3">Datum termina</h5>
                  <DatePicker
                    selected={appointmentDate}
                    onChange={handleDateChange}
                    customInput={<DateInput />}
                    locale="hr"
                    minDate={new Date()}
                    closeOnScroll
                    dateFormat="Pp"
                  />
                </Col>

                {/* Ovdje ide prikaz tablice zauzetih termina */}
                {dateChecked &&
                  (appointmentsLoading ? (
                    <Col sm={8}>
                      <div className="text-center text-muted justify-content-center">
                        <h6 className="pb-2">
                          ...Učitavanje zauzetih termina...
                        </h6>
                        <Spinner animation="border" variant="info" />
                      </div>
                    </Col>
                  ) : (
                    <Col sm={8}>
                      <h5 className="mb-3">
                        Zauzeti termini na dan{" "}
                        {new Date(appointmentDate).toLocaleDateString()}
                      </h5>
                      {takenTimes.length ? (
                        <Table striped size="sm" variant="light">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Početak</th>
                              <th>Završetak</th>
                              <th>Frizer</th>
                            </tr>
                          </thead>
                          <tbody>
                            {takenTimes.map((app, idx) => {
                              return (
                                <tr key={app.id}>
                                  <td>{idx + 1}.</td>

                                  <td>{`${app.startTime.hours.toLocaleString(
                                    undefined,
                                    {
                                      minimumIntegerDigits: 2,
                                      useGrouping: false,
                                    }
                                  )}:${app.startTime.minutes.toLocaleString(
                                    undefined,
                                    {
                                      minimumIntegerDigits: 2,
                                      useGrouping: false,
                                    }
                                  )}`}</td>
                                  <td>{`${app.endTime.hours.toLocaleString(
                                    undefined,
                                    {
                                      minimumIntegerDigits: 2,
                                      useGrouping: false,
                                    }
                                  )}:${app.endTime.minutes.toLocaleString(
                                    undefined,
                                    {
                                      minimumIntegerDigits: 2,
                                      useGrouping: false,
                                    }
                                  )}`}</td>
                                  <td>
                                    {app.hairdresserId ? (
                                      <div>{app.hairdresserId.name}</div>
                                    ) : (
                                      "Neodređen/a"
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <h6 className="text-muted">
                          Za taj datum nema rezerviranih termina.
                        </h6>
                      )}
                    </Col>
                  ))}

                <Col sm={12} className="mb-3">
                  <hr />
                  <h5 className="mb-3">Vrsta termina</h5>
                  <DropdownButton
                    id="dropdown-item-button"
                    title={appointmentTypeSelect}
                    variant="outline-info"
                  >
                    {appointmentTypes.map((app) => {
                      return (
                        <Dropdown.Item
                          as="button"
                          key={app.id}
                          className="d-flex"
                          onClick={() => handleTypeSelect(app)}
                        >
                          <div>{app.name}</div>
                          <div className="ml-auto">
                            <div className="border-left my-0 py-0 d-inline mx-2 "></div>
                            <Badge variant="info">{app.price} kn</Badge>
                          </div>
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                  {appointmentTypeSelect !== "Odaberi" && (
                    <div className="my-3">
                      <h6 className="text-muted d-inline">Trajanje: </h6>
                      <span>{appointmentType.duration} min</span>
                      <br></br>
                      <h6 className="text-muted d-inline">Cijena: </h6>
                      <span>{appointmentType.price} kn</span>
                    </div>
                  )}
                  <hr />
                </Col>
                <Col sm={12} className="mb-3">
                  <h5 className="mb-3">Vrijeme termina</h5>
                  <DatePicker
                    selected={appointmentTime}
                    onChange={handleTimeChange}
                    timeCaption="Vrijeme"
                    timeInputLabel="Vrijeme:"
                    locale="hr"
                    showTimeSelect
                    showTimeSelectOnly
                    closeOnScroll
                    /* showTimeInput */
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="HH:mm"
                    customInput={<TimeInput />}
                  />
                  <hr />
                </Col>
                <Col sm={12} className="mb-3">
                  <h5 className="mb-3">
                    Frizer/ka<small>(opcionalno)</small>
                  </h5>
                  <DropdownButton
                    id="dropdown-item-button"
                    title={hairdressersSelect}
                    variant="outline-info"
                  >
                    {workingHairdressers.map((hairdresser) => {
                      return (
                        <Dropdown.Item
                          as="button"
                          key={hairdresser.id}
                          className="d-flex"
                          onClick={() => handleHairdresserSelect(hairdresser)}
                        >
                          <div>{hairdresser.name}</div>
                        </Dropdown.Item>
                      );
                    })}
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as="button"
                      className="d-flex"
                      onClick={() => handleHairdresserSelect({})}
                    >
                      <div>Neodređen/a - zadano</div>
                    </Dropdown.Item>
                  </DropdownButton>
                  <hr />
                </Col>
              </Row>
              {messageToggled && (
                <Alert variant={messageVariant}>{message}</Alert>
              )}

              <Button
                variant="success"
                disabled={!appointmentValid}
                className="w-100"
                onClick={handleSubmit}
              >
                Potvrdi rezervaciju
              </Button>
            </Card.Body>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Card>
  );
};

export default Salon;
