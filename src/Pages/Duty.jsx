import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import Layout from './Layout';
import { Button, Modal, ModalBody, Form, Row, Col, FormFeedback, Input, FormGroup, Label, ModalHeader, Table, Spinner, CardBody } from "reactstrap";
import { FaPlus, FaUser, FaBus, FaRegClock } from "react-icons/fa";
//Flatpickr
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import moment from "moment";
import { toast } from 'react-toastify';
import { GiDuration } from "react-icons/gi";

const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

const Duty = () => {
    const [modal, setModal] = useState(false);
    const [shiftsData, setShiftsData] = useState({});
    const [start_Date, setStart_Date] = useState();
    const [end_date, setEnd_date] = useState();
    const [errorstaDate, setErrorstaDate] = useState();
    const [errorendDate, setErrorendDate] = useState();
    const [loading, setLoading] = useState(false);
    const [duty_date, setDuty_date] = useState();
    const [allVehicle, setAllVehicle] = useState();
    const [startTime, setStartTime] = useState(null);

    const [timeError, setTimeError] = useState();
    const [dateError, setDateError] = useState();
    const [formData, setFormData] = useState({
        vehicle: '', driver: '', conductor: '', duration: ''
    });
    const [allDuties, setAllDuties] = useState();
    const [allDrivers, setAllDrivers] = useState();
    const [allconductors, setAllconductors] = useState();
    const api_url = 'http://localhost:3000/api';

    useEffect(() => {
        fetchCrewData();
        fetch_vehicle();
        fetchDuties();
    }, []);
    //fetch Duties
    const fetchDuties = async () => {
        try {
            setLoading(true)
            let response = await fetch(`${api_url}/getall`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                setLoading(false)
                const results = await response.json();
                const apiData = results.data;
                setAllDuties(apiData);
                const formattedData = {};
                apiData.forEach((shift) => {
                    const day = new Date(shift.date).toLocaleDateString("en-US", { weekday: "long" });
                    if (!formattedData[day]) formattedData[day] = [];
                    formattedData[day].push({
                        vehicle: shift.vehicleId.name,
                        driver: shift.driverId.name,
                        conductor: shift.conductorId.name,
                        startTime: shift.startTime,
                        duration: `${shift.duration} hrs`,
                        bgColor: "#fff",
                    });
                });
                setShiftsData(formattedData);
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };

    //fetch vehicles
    const fetch_vehicle = async () => {
        try {
            let response = await fetch(`${api_url}/vehicles`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                setAllVehicle(results.data)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };
    //fetch drivers
    const fetchCrewData = async () => {
        try {
            let response = await fetch(`${api_url}/crew`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const results = await response.json();
                const crewData = results.data;
                const find_drivers = crewData.filter((d) => d.role === 'Driver');
                const find_conductor = crewData.filter((d) => d.role === 'Conductor');
                setAllDrivers(find_drivers);
                setAllconductors(find_conductor)
            }
        } catch (err) {
            console.log(err, 'data fetching error')
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((pre) => ({ ...pre, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            try {
                let payload = {
                    date: duty_date,
                    vehicleId: formData.vehicle,
                    driverId: formData.driver,
                    conductorId: formData.conductor,
                    startTime: moment(startTime).format("HH:mm A"),
                    duration: formData.duration
                }
                let response = await fetch(`${api_url}/assign_duty`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                if (response.status === 200) {
                    const results = await response.json();
                    toast(results.message);
                    setModal(false);
                    setDuty_date('');
                    setStartTime('')
                    setFormData({
                        vehicle: '', driver: '', conductor: '', duration: ''
                    });
                    fetchDuties();
                } else {
                    toast.error('Something went wrong!')
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            e.target.classList.add('was-validated')
            if (!duty_date) {
                setDateError('This field is required')
            }
            if (!startTime) {
                setTimeError('This field is required')
            }
        }

    };
    const hanle_fetch_duties = async (e) => {
        e.preventDefault();
        if (e.target.checkValidity()) {
            try {
                if (!start_Date && !end_date) {
                    toast('Please select start and end date')
                } else {
                    setLoading(true);

                    let response = await fetch(`${api_url}/duties?startDate=${start_Date}&endDate=${end_date}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.status === 200) {
                        const results = await response.json();
                        const apiData = results.data;
                        setAllDuties(apiData);
                        const formattedData = {};
                        apiData.forEach((shift) => {
                            const day = new Date(shift.date).toLocaleDateString("en-US", { weekday: "long" });
                            if (!formattedData[day]) formattedData[day] = [];
                            formattedData[day].push({
                                vehicle: shift.vehicleId.name,
                                driver: shift.driverId.name,
                                conductor: shift.conductorId.name,
                                startTime: shift.startTime,
                                duration: `${shift.duration} hrs`,
                                bgColor: "#fff",
                            });
                        });
                        setShiftsData(formattedData);
                        setLoading(false)
                    }
                }
            } catch (err) {
                console.log(err, 'err')
            }

        } else {
            e.target.classList.add("was-validated");
            if (!start_Date) {
                setErrorstaDate('Please select from date')
            }
            if (!end_date) {
                setErrorendDate('Please select to date')
            }
        }
    }
    return (
        <>
            <Layout>
                <div className='d-flex justify-content-between p-3'>
                    <h4>Duty</h4>
                    <Button className='btn btn-primary' onClick={() => setModal(true)}><FaPlus />   Add New</Button>
                </div>
                <CardBody>
                    <Row>
                        <Col md={12}>
                            <Form onSubmit={hanle_fetch_duties} noValidate>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="start_Date">From Date </Label>
                                            <Input
                                                value={start_Date ? start_Date : null}
                                                type="text" tag={Flatpickr}
                                                name="start_Date"
                                                id="start_Date" placeholder="Enter Date"
                                                options={{
                                                    dateFormat: 'd-m-Y',
                                                }}
                                                onChange={(selectedDates) => {
                                                    setStart_Date(selectedDates[0]);
                                                    setErrorstaDate('')
                                                }} required
                                                className={`form-control ${errorstaDate ? 'is-invalid' : ''}`}
                                            />
                                            <small className="error">{errorstaDate ? errorstaDate : ''}</small>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="end_date">To Date </Label>
                                            <Input
                                                type="text" tag={Flatpickr}
                                                name="end_date"
                                                value={end_date ? end_date : null}
                                                id="end_date" placeholder="Enter Date"
                                                options={{
                                                    dateFormat: 'd-m-Y',
                                                    minDate: start_Date
                                                }}
                                                onChange={(selectedDates) => {
                                                    setEnd_date(selectedDates[0]);
                                                    setErrorendDate('')
                                                }}
                                                className={`form-control ${errorendDate ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            <small className="error">{errorendDate ? errorendDate : ''}</small>

                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup className="mt-4 pt-1">
                                            <Button className="btn btn-info" type="submit">Show</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </CardBody>
                <hr />
                {loading ?
                    <Row className='w-100'>
                        <Col className='p-5 text-center'>
                            <Spinner />
                        </Col>
                    </Row>
                    : allDuties && allDuties.length > 0 ?
                        <ScheduleContainer>
                            {allDays.map((day) => (
                                <DayColumn key={day}>
                                    <Title>{day}</Title>
                                    {shiftsData[day]?.length > 0 ? (
                                        shiftsData[day].map((shift, index) => (
                                            <Shift key={index} bgColor={shift.bgColor} >
                                                <p className="mb-1 d-flex justify-content-between" style={{ fontSize: '13px' }}><span className="text-muted" ><FaBus /> Vehicle:</span> {shift.vehicle}</p>
                                                <p className="mb-1 d-flex justify-content-between" style={{ fontSize: '13px' }}><span className="text-muted" ><FaUser /> Driver:</span> {shift.driver}</p>
                                                <p className="mb-1 d-flex justify-content-between" style={{ fontSize: '13px' }}><span className="text-muted" ><FaUser /> Conductor:</span> {shift.conductor}</p>
                                                <p className="mb-1 d-flex justify-content-between" style={{ fontSize: '13px' }}><span className="text-muted" ><FaRegClock /> Start Time:</span> {shift.startTime}</p>
                                                <p className="mb-1 d-flex justify-content-between" style={{ fontSize: '13px' }}><span className="text-muted" ><GiDuration /> Duration:</span> {shift.duration}</p>
                                            </Shift>
                                        ))
                                    ) : (
                                        <Shift bgColor="#bdc3c7">DAY OFF</Shift>
                                    )}
                                </DayColumn>
                            ))}
                        </ScheduleContainer>
                        : <Row>
                            <Col className='text-center pt-5'>
                                <h3>Data not available</h3>
                            </Col>
                        </Row>
                }
                <Modal size="lg" isOpen={modal}
                    toggle={() => setModal(!modal)}>
                    <ModalHeader toggle={() => setModal(!modal)}>Add New Duty</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit} noValidate>
                            <Row>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label for="duty_date"> Date *</Label>
                                        <Input
                                            value={duty_date ? duty_date : ''}
                                            type="text" tag={Flatpickr}
                                            name="duty_date"
                                            id="duty_date" placeholder="Enter Date"
                                            options={{
                                                dateFormat: 'd-m-Y',
                                            }}
                                            onChange={(selectedDates) => {
                                                setDuty_date(selectedDates[0]);
                                                setDateError('')
                                            }}
                                            required
                                            className={`form-control ${dateError ? 'is-invalid' : ''}`}
                                        />
                                        <small className="text-danger">{dateError ? dateError : ''}</small>

                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Vehicle *</Label>
                                        <Input type="select" name="vehicle" value={formData.vehicle} onChange={handleChange} required >
                                            <option value=''>Select Vehicle</option>
                                            {allVehicle?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>

                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Driver *</Label>
                                        <Input type="select" name="driver" value={formData.driver} onChange={handleChange} required >
                                            <option value=''>Select Driver</option>
                                            {allDrivers?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Conductor *</Label>
                                        <Input type="select" name="conductor" value={formData.conductor} onChange={handleChange} required >
                                            <option value=''>Select Conductor</option>
                                            {allconductors?.map((data) => (
                                                <option value={data._id}>{data.name}</option>
                                            ))}
                                        </Input>
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Start Time *</Label>
                                        <Flatpickr
                                            value={startTime}
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "h:i K",
                                                time_24hr: false,
                                            }}
                                            onChange={(selectedDates) => {
                                                setStartTime(selectedDates[0]);
                                                setTimeError('')
                                            }}
                                            placeholder="Select Time"
                                            required
                                            className={`form-control ${timeError ? 'is-invalid' : ''}`}

                                        />
                                        <small className="text-danger">{timeError ? timeError : ''}</small>
                                    </FormGroup>
                                </Col>
                                <Col lg={6} md={12} >
                                    <FormGroup>
                                        <Label>Duration *</Label>
                                        <Input type="number" name="duration" placeholder='Enter Duration In Hour' value={formData.duration} onChange={handleChange} required />
                                        <FormFeedback>This field is required</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <FormGroup className="text-center">
                                <Button type="submit" color="primary">Submit</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Layout>
        </>
    )
}

const ScheduleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  background-color: #f4f4f4;
  color: #333;
  min-height: 100vh;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DayColumn = styled.div`
  padding: 0px;
  border-radius: 8px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 12px;
  color: #fff;
  background: #000;
  padding: 10px;
  width:100%;
border-radius:12px;
  font-size: 18px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

`;

const Shift = styled.div`
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: #000;
  background: ${(props) => props.bgColor || "#999"};
  width: 100%;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;  
  max-width: 170px;
`;

export default Duty
